import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export const runtime = "nodejs";

const registeredJobWhere = { status: "ACTIVE" as const, company: { employerAccount: { isNot: null } } };

function normalizeText(val: string): string {
  return val.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const ROLE_ALIASES: Record<string, string[]> = {
  "ai/ml engineer": ["aiml", "aimlengineer", "ai", "ml", "artificial intelligence", "machine learning", "deep learning", "ai engineer", "ml engineer"],
  "data analyst & bi specialist": ["data analyst", "data", "bi", "power bi", "powerbi", "sql", "business intelligence", "analyst"],
  "battery management system (bms) calibration specialist": ["bms", "battery", "ev", "high voltage", "can bus", "calibration", "bms lead"],
  "industrial automation & plc specialist": ["plc", "scada", "automation", "industrial automation", "automation engineer"],
  "autonomous robotics (ros 2) engineer": ["ros", "ros2", "robotics", "robot", "manipulator", "autonomous", "robotics engineer"],
  "full stack web & cloud developer": ["full stack", "fullstack", "developer", "web", "software engineer", "cloud", "react", "typescript"],
};

async function jobsForEvidence(title: string) {
  return prisma.job.findMany({
    where: { ...registeredJobWhere, title: { equals: title, mode: "insensitive" } },
    include: {
      company: { select: { id: true, name: true } },
      declaredRequirements: true,
      jobSkills: { include: { skill: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

function requirementsFromJobs(jobs: Awaited<ReturnType<typeof jobsForEvidence>>) {
  const grouped = new Map<string, { skillId: string; name: string; requiredLevel: string; evidence: any[] }>();
  for (const job of jobs) {
    const requirements = [
      ...job.declaredRequirements.map((item) => ({ id: item.id, name: item.name, level: item.proficiency })),
      ...job.jobSkills.map((item) => ({ id: item.skill.id, name: item.skill.name, level: item.requiredLevel })),
    ];
    for (const item of requirements) {
      const key = item.name.trim().toLowerCase();
      const existing = grouped.get(key) || { skillId: item.id, name: item.name, requiredLevel: item.level, evidence: [] };
      existing.evidence.push({
        type: "employer requirement",
        signal: "job-posting signal",
        employer: job.company.name,
        posting: job.title,
        source: `/jobs/${job.id}`,
        sourceId: job.id,
        timestamp: job.updatedAt.toISOString(),
      });
      grouped.set(key, existing);
    }
  }
  return Array.from(grouped.values());
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const query = request.nextUrl.searchParams.get("q")?.trim();
    if (query) {
      if (query.length < 2) return NextResponse.json({ roles: [] });

      const allJobs = await prisma.job.findMany({
        where: registeredJobWhere,
        include: { company: { select: { name: true } }, declaredRequirements: true },
        orderBy: { updatedAt: "desc" },
        take: 100,
      });

      const normQuery = normalizeText(query);
      const queryTokens = query.toLowerCase().split(/[\s,./\-_]+/).filter(Boolean);

      const matchedJobs = allJobs.filter((job) => {
        const titleNorm = normalizeText(job.title);
        const titleLower = job.title.toLowerCase();

        // 1. Direct normalized match (e.g. "aimlengineer" === "aimlengineer")
        if (titleNorm.includes(normQuery) || normQuery.includes(titleNorm)) return true;

        // 2. Token match in title, sector, description, or requirements
        const sectorLower = (job.sectorText || "").toLowerCase();
        const descLower = job.description.toLowerCase();
        const reqsLower = job.declaredRequirements.map((r) => r.name.toLowerCase()).join(" ");

        const fullText = `${titleLower} ${sectorLower} ${descLower} ${reqsLower}`;
        if (queryTokens.every((token) => fullText.includes(token))) return true;

        // 3. Alias dictionary match
        for (const [canonicalKey, aliases] of Object.entries(ROLE_ALIASES)) {
          if (titleLower.includes(canonicalKey) || canonicalKey.includes(titleLower)) {
            if (aliases.some((alias) => normQuery.includes(normalizeText(alias)) || normalizeText(alias).includes(normQuery))) {
              return true;
            }
          }
        }

        return false;
      });

      const grouped = new Map<string, RoleSearchAccumulator>();
      for (const job of matchedJobs) {
        const key = job.title.trim().toLowerCase();
        const item = grouped.get(key) || {
          id: job.id,
          title: job.title,
          sector: job.sectorText || "Sector not provided",
          activePostings: 0,
          employers: new Set<string>(),
          latestEvidenceAt: job.updatedAt,
        };
        item.activePostings += 1;
        item.employers.add(job.company.name);
        if (job.updatedAt > item.latestEvidenceAt) {
          item.latestEvidenceAt = job.updatedAt;
          item.id = job.id;
        }
        grouped.set(key, item);
      }

      return NextResponse.json({
        roles: Array.from(grouped.values())
          .slice(0, 10)
          .map((item) => ({
            ...item,
            employers: Array.from(item.employers),
            latestEvidenceAt: item.latestEvidenceAt.toISOString(),
          })),
      });
    }

    // When query is not provided (initial page load)
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId } });

    // Fetch all active jobs to build suggested roles and assist auto-resolution
    const allJobs = await prisma.job.findMany({
      where: registeredJobWhere,
      include: { company: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    });

    const suggestedMap = new Map<string, RoleSearchAccumulator>();
    for (const job of allJobs) {
      const key = job.title.trim().toLowerCase();
      const item = suggestedMap.get(key) || {
        id: job.id,
        title: job.title,
        sector: job.sectorText || "Sector not provided",
        activePostings: 0,
        employers: new Set<string>(),
        latestEvidenceAt: job.updatedAt,
      };
      item.activePostings += 1;
      item.employers.add(job.company.name);
      suggestedMap.set(key, item);
    }
    const suggestedRoles = Array.from(suggestedMap.values()).map((item) => ({
      ...item,
      employers: Array.from(item.employers),
      latestEvidenceAt: item.latestEvidenceAt.toISOString(),
    }));

    let selectedJob = null;
    if (profile?.targetJobRoleId) {
      selectedJob = await prisma.job.findFirst({ where: { id: profile.targetJobRoleId, ...registeredJobWhere } });
    }

    // Auto-resolve if candidate has targetRole (e.g. "AIML ENGINEER") but targetJobRoleId is null/unlinked
    if (!selectedJob && profile?.targetRole) {
      const normTarget = normalizeText(profile.targetRole);
      const matched = allJobs.find((j) => {
        const titleNorm = normalizeText(j.title);
        return titleNorm === normTarget || normTarget.includes(titleNorm) || titleNorm.includes(normTarget);
      });
      if (matched) {
        selectedJob = matched;
        await prisma.candidateProfile.update({
          where: { id: profile.id },
          data: { targetJobRoleId: matched.id, targetRole: matched.title },
        });
      }
    }

    if (!selectedJob) {
      return NextResponse.json({ selectedRole: null, suggestedRoles });
    }

    const jobs = await jobsForEvidence(selectedJob.title);
    const requirements = requirementsFromJobs(jobs);

    return NextResponse.json({
      selectedRole: {
        id: selectedJob.id,
        title: selectedJob.title,
        sector: selectedJob.sectorText || "Sector not provided",
      },
      requirements,
      insufficientEvidence: requirements.length === 0,
      suggestedRoles,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load role evidence.";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const { roleId } = await request.json();
    if (typeof roleId !== "string" || !roleId.trim()) {
      return NextResponse.json({ error: "Select an available role." }, { status: 400 });
    }

    let selectedJob = await prisma.job.findFirst({ where: { id: roleId.trim(), ...registeredJobWhere } });
    if (!selectedJob) {
      // Allow selecting by title if passed
      selectedJob = await prisma.job.findFirst({
        where: { title: { equals: roleId.trim(), mode: "insensitive" }, ...registeredJobWhere },
      });
    }

    if (!selectedJob) {
      const normTarget = normalizeText(roleId);
      const all = await prisma.job.findMany({ where: registeredJobWhere });
      selectedJob = all.find((j) => normalizeText(j.title) === normTarget || normTarget.includes(normalizeText(j.title))) || null;
    }

    if (!selectedJob) {
      return NextResponse.json({ error: "This role has no active registered-employer evidence." }, { status: 409 });
    }

    const jobs = await jobsForEvidence(selectedJob.title);
    const requirements = requirementsFromJobs(jobs);

    await prisma.candidateProfile.update({
      where: { userId: auth.userId },
      data: { targetRole: selectedJob.title, targetJobRoleId: selectedJob.id },
    });

    return NextResponse.json({
      selectedRole: { id: selectedJob.id, title: selectedJob.title, sector: selectedJob.sectorText || "Sector not provided" },
      requirements,
      insufficientEvidence: requirements.length === 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not select role.";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

type RoleSearchAccumulator = { id: string; title: string; sector: string; activePostings: number; employers: Set<string>; latestEvidenceAt: Date };
