import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

function githubRepository(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    const parts = url.pathname.split("/").filter(Boolean);
    return url.protocol === "https:" && url.hostname.toLowerCase() === "github.com" && parts.length >= 2
      ? `https://github.com/${parts[0]}/${parts[1].replace(/\.git$/, "")}` : null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId } });
    if (!profile) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    const projects = await prisma.project.findMany({
      where: { candidateProfileId: profile.id }, orderBy: { completedDate: "desc" },
      include: { declaredSkillEvidence: { include: { candidateDeclaredSkill: true } } },
    });
    return NextResponse.json({ projects: projects.map((project) => ({ ...project, skills: project.declaredSkillEvidence.map((item) => item.candidateDeclaredSkill.name) })) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load projects";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const repositoryUrl = githubRepository(body.repositoryUrl);
    if (!body.title?.trim() || !body.description?.trim() || !repositoryUrl) {
      return NextResponse.json({ error: "Title, description and a valid public GitHub repository URL are required." }, { status: 400 });
    }
    const technologies = Array.isArray(body.technologies)
      ? body.technologies.map((item: unknown) => String(item).trim()).filter(Boolean).slice(0, 20) : [];
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId }, include: { declaredSkills: true } });
    if (!profile) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    let reachable = false;
    let metadata: any = null;
    let languages: Record<string, number> | null = null;
    let readmePresent: boolean | null = null;
    try {
      const [, owner, repo] = new URL(repositoryUrl).pathname.split("/");
      const headers = { Accept: "application/vnd.github+json", "User-Agent": "CAREERIS-evidence-verifier" };
      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { headers, signal: AbortSignal.timeout(8000) });
      reachable = response.ok;
      if (response.ok) {
        metadata = await response.json();
        const [languageResponse, readmeResponse] = await Promise.all([
          fetch(metadata.languages_url, { headers, signal: AbortSignal.timeout(8000) }),
          fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, { headers, signal: AbortSignal.timeout(8000) }),
        ]);
        languages = languageResponse.ok ? await languageResponse.json() : null;
        readmePresent = readmeResponse.ok;
      }
    } catch { reachable = false; }
    const technologyNames = new Set(technologies.map((name: string) => name.toLowerCase()));
    const linkedSkills = profile.declaredSkills.filter((skill) => technologyNames.has(skill.normalizedName));
    const project = await prisma.project.create({
      data: {
        candidateProfileId: profile.id, title: body.title.trim(), description: body.description.trim(), repositoryUrl,
        technologies, repositoryReachable: reachable, repositoryCheckedAt: new Date(),
        repositoryOwner: metadata?.owner?.login || null, repositoryName: metadata?.name || null,
        repositoryDescription: metadata?.description || null, repositoryLanguages: languages || undefined,
        repositoryPushedAt: metadata?.pushed_at ? new Date(metadata.pushed_at) : null, readmePresent,
        repositoryMetadata: metadata ? { htmlUrl: metadata.html_url, defaultBranch: metadata.default_branch, isFork: metadata.fork, createdAt: metadata.created_at, updatedAt: metadata.updated_at, forks: metadata.forks_count, stars: metadata.stargazers_count } : undefined,
        verificationStatus: reachable ? "UNVERIFIED" : "REJECTED", verificationMethod: "GITHUB_PUBLIC_API",
        verificationReason: reachable ? "Repository metadata is available, but ownership verification is unavailable." : "The public GitHub repository could not be verified as reachable.",
        ownershipStatus: "UNAVAILABLE", evidenceStatus: reachable ? "METADATA_RECORDED" : "REPOSITORY_NOT_REACHABLE",
        declaredSkillEvidence: { create: linkedSkills.map((skill) => ({ candidateDeclaredSkillId: skill.id, status: "SUBMITTED" })) },
      },
    });
    await prisma.auditLog.create({ data: { userId: auth.userId, action: "PROJECT_EVIDENCE_SUBMIT", entity: "Project", entityId: project.id, newValue: { verificationStatus: project.verificationStatus, repositoryReachable: project.repositoryReachable } } });
    return NextResponse.json({ project, linkedSkills: linkedSkills.map((skill) => skill.name) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save project evidence";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
