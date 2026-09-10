import { prisma } from "@/server/db/prisma";

export async function getCandidateEvidence(userId: string) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { fullName: true, email: true } },
      declaredSkills: { orderBy: { name: "asc" }, include: { projectEvidence: { include: { project: true } } } },
      projects: { orderBy: { completedDate: "desc" } },
      enrollments: { include: { course: { include: { courseSkills: { include: { skill: true } } } } } },
    },
  });
  if (!profile) throw new Error("Candidate profile not found");
  return profile;
}

export async function getTargetRoleEvidence(targetJobId: string | null) {
  if (!targetJobId) return null;
  const selected = await prisma.job.findFirst({
    where: { id: targetJobId, status: "ACTIVE", company: { employerAccount: { isNot: null } } },
    select: { id: true, title: true, sectorText: true },
  });
  if (!selected) return null;
  const jobs = await prisma.job.findMany({
    where: { status: "ACTIVE", title: { equals: selected.title, mode: "insensitive" }, company: { employerAccount: { isNot: null } } },
    include: { company: { select: { name: true } }, declaredRequirements: true, jobSkills: { include: { skill: true } } },
  });
  const requirementMap = new Map<string, {
    name: string; normalizedName: string; proficiency: string; mandatory: boolean;
    evidence: Array<{ jobId: string; employer: string; posting: string; timestamp: string }>;
  }>();
  for (const job of jobs) {
    const requirements = [
      ...job.declaredRequirements.map((item) => ({ name: item.name, normalizedName: item.normalizedName, proficiency: item.proficiency, mandatory: item.isMandatory })),
      ...job.jobSkills.map((item) => ({ name: item.skill.name, normalizedName: item.skill.normalizedName, proficiency: item.requiredLevel, mandatory: item.isMandatory })),
    ];
    for (const requirement of requirements) {
      const current = requirementMap.get(requirement.normalizedName) || { ...requirement, evidence: [] };
      current.evidence.push({ jobId: job.id, employer: job.company.name, posting: job.title, timestamp: job.updatedAt.toISOString() });
      requirementMap.set(requirement.normalizedName, current);
    }
  }
  return { ...selected, jobsCount: jobs.length, requirements: Array.from(requirementMap.values()) };
}

export function hasProjectEvidence(skill: { projectEvidence: Array<{ status: string; project: { repositoryReachable: boolean | null } }> }) {
  return skill.projectEvidence.some((item) => item.project.repositoryReachable === true && item.status === "VERIFIED");
}
