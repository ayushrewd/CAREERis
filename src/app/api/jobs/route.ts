import { NextRequest, NextResponse } from "next/server";
import { JobType, ProficiencyLevel } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { normalizeSkillName, resolveOrCreateSkill } from "@/server/services/skill/prismaSkillService";

const levels = new Set(Object.values(ProficiencyLevel));
const jobTypes = new Set(Object.values(JobType));

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim();
    const location = request.nextUrl.searchParams.get("location")?.trim();
    const skill = request.nextUrl.searchParams.get("skill")?.trim().toLowerCase();
    const sector = request.nextUrl.searchParams.get("sector")?.trim();
    const mine = request.nextUrl.searchParams.get("mine") === "1";
    let companyId: string | undefined;
    if (mine) {
      const auth = resolveAuthContext(request);
      if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required" }, { status: 403 });
      const account = await prisma.employerAccountProfile.findUnique({ where: { userId: auth.userId } });
      companyId = account?.companyId || undefined;
      if (!companyId) return NextResponse.json({ jobs: [] });
    }
    const jobs = await prisma.job.findMany({
      where: {
        ...(mine ? { companyId } : { status: "ACTIVE", company: { employerAccount: { isNot: null } } }),
        ...(location ? { locationText: { contains: location, mode: "insensitive" } } : {}),
        ...(sector ? { sectorText: { contains: sector, mode: "insensitive" } } : {}),
        AND: [
          ...(query ? [{ OR: [{ title: { contains: query, mode: "insensitive" as const } }, { company: { name: { contains: query, mode: "insensitive" as const } } }, { description: { contains: query, mode: "insensitive" as const } }] }] : []),
          ...(skill ? [{
            OR: [
              { declaredRequirements: { some: { normalizedName: { contains: skill } } } },
              { jobSkills: { some: { skill: { normalizedName: { contains: skill } } } } },
            ],
          }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { company: { select: { name: true, isVerified: true } }, declaredRequirements: true, jobSkills: { include: { skill: true } }, _count: { select: { applications: true } } },
    });
    return NextResponse.json({ jobs: jobs.map((job) => ({
      id: job.id, title: job.title, description: job.description, company: job.company.name,
      companyVerified: job.company.isVerified, location: job.locationText, sector: job.sectorText,
      jobType: job.jobType, minExperience: job.minExperience, maxExperience: job.maxExperience,
      qualification: job.qualification, minSalaryINR: job.minSalaryINR, maxSalaryINR: job.maxSalaryINR,
      openPositions: job.openPositions, status: job.status, applications: job._count.applications, createdAt: job.createdAt,
      requirements: [...job.declaredRequirements.map((item) => ({ name: item.name, proficiency: item.proficiency, mandatory: item.isMandatory })), ...job.jobSkills.map((item) => ({ name: item.skill.name, proficiency: item.requiredLevel, mandatory: item.isMandatory }))],
    })) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load jobs";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required" }, { status: 403 });
    const account = await prisma.employerAccountProfile.findUnique({ where: { userId: auth.userId } });
    if (!account?.companyId || !account.canPostJobs) return NextResponse.json({ error: "This company account cannot publish jobs." }, { status: 403 });
    const body = await request.json();
    const requirements = Array.isArray(body.requirements) ? body.requirements.map((item: any) => ({
      name: String(item.name || "").trim(), normalizedName: normalizeSkillName(String(item.name || "")),
      proficiency: levels.has(item.proficiency) ? item.proficiency as ProficiencyLevel : ProficiencyLevel.INTERMEDIATE,
      isMandatory: item.mandatory !== false,
      weight: Math.max(0.1, Math.min(10, Number(item.weight) || 1)),
    })).filter((item: any) => item.name) : [];
    if (!body.title?.trim() || !body.description?.trim() || !body.location?.trim() || requirements.length === 0) return NextResponse.json({ error: "Title, description, location and at least one required skill are required." }, { status: 400 });
    const job = await prisma.$transaction(async (tx) => {
      const created = await tx.job.create({ data: {
        companyId: account.companyId!, title: body.title.trim(), description: body.description.trim(),
        qualification: body.qualification?.trim() || null, locationText: body.location.trim(), sectorText: body.sector?.trim() || null,
        jobType: jobTypes.has(body.jobType) ? body.jobType as JobType : JobType.FULL_TIME,
        minExperience: Math.max(0, Number(body.minExperience) || 0), maxExperience: body.maxExperience === "" ? null : Number(body.maxExperience) || null,
        minSalaryINR: body.minSalaryINR === "" ? null : Number(body.minSalaryINR) || null,
        maxSalaryINR: body.maxSalaryINR === "" ? null : Number(body.maxSalaryINR) || null,
        openPositions: Math.max(1, Number(body.openPositions) || 1), status: "ACTIVE",
      } });
      const source = await tx.dataSource.create({ data: { name: `CAREERIS company job ${created.id}`, sourceType: "JOB_POSTINGS", timePeriod: new Date().toISOString().slice(0, 10), geographyScope: body.location.trim(), confidence: 100, methodology: "Direct requirement submitted by a registered CAREERIS company account", version: "1" } });
      for (const requirement of requirements) {
        const skill = await resolveOrCreateSkill(requirement.name, tx);
        await tx.jobSkill.create({ data: { jobId: created.id, skillId: skill.id, requiredLevel: requirement.proficiency, isMandatory: requirement.isMandatory, weight: requirement.weight } });
        await tx.jobRequirement.create({ data: { jobId: created.id, name: skill.name, normalizedName: skill.normalizedName, proficiency: requirement.proficiency, isMandatory: requirement.isMandatory } });
        await tx.demandSignal.create({ data: { dataSourceId: source.id, skillId: skill.id, openPositions: created.openPositions, growthRateYoY: 0, recordedDate: created.createdAt, sourceEntity: "JOB", sourceEntityId: created.id, provenance: { companyId: account.companyId, jobId: created.id } } });
      }
      await tx.auditLog.create({ data: { userId: auth.userId, action: "JOB_CREATE", entity: "Job", entityId: created.id, newValue: { title: created.title, skillCount: requirements.length } } });
      return tx.job.findUniqueOrThrow({ where: { id: created.id }, include: { declaredRequirements: true, jobSkills: { include: { skill: true } }, company: true } });
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create job";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
