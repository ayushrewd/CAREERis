import { EvidenceVerificationStatus, ProficiencyLevel } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { normalizeSkillName, proficiencyRank, scoreToProficiency } from "@/server/services/skill/prismaSkillService";

export const MATCH_WEIGHTS = Object.freeze({ coverage: 40, proficiency: 25, verifiedEvidence: 20, experience: 10, qualification: 5 });
const PASS_THRESHOLD = Number(process.env.ASSESSMENT_PASS_THRESHOLD || 70);

function extractYears(value: string | null): number | null {
  if (!value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:years?|yrs?)/i);
  return match ? Number(match[1]) : null;
}

export async function calculateJobMatch(userId: string, jobId: string) {
  const [job, profile] = await Promise.all([
    prisma.job.findFirst({
      where: { id: jobId, status: "ACTIVE", company: { employerAccount: { isNot: null } } },
      include: { company: true, jobSkills: { include: { skill: true } }, declaredRequirements: true },
    }),
    prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        declaredSkills: { include: { skill: true, projectEvidence: { include: { project: true } } } },
        candidateSkills: { include: { skill: true, evidences: true } },
      },
    }),
  ]);
  if (!job) throw new Error("Job not found");
  if (!profile) throw new Error("Candidate profile not found");

  const requirements = job.jobSkills.length
    ? job.jobSkills.map((item) => ({ id: item.skillId, name: item.skill.name, normalizedName: item.skill.normalizedName, requiredLevel: item.requiredLevel, mandatory: item.isMandatory, weight: item.weight }))
    : job.declaredRequirements.map((item) => ({ id: item.id, name: item.name, normalizedName: item.normalizedName, requiredLevel: item.proficiency, mandatory: item.isMandatory, weight: 1 }));
  if (!requirements.length) return { job, rows: [], score: null, insufficientEvidence: true, reason: "Insufficient evidence: this job has no canonical skill requirements." };

  const declared = new Map(profile.declaredSkills.map((item) => [item.skill?.normalizedName || normalizeSkillName(item.name), item]));
  const canonical = new Map(profile.candidateSkills.map((item) => [item.skill.normalizedName, item]));
  const totalRequirementWeight = requirements.reduce((sum, item) => sum + Math.max(0.1, item.weight), 0);
  let coverage = 0;
  let proficiency = 0;
  let verifiedEvidence = 0;

  const rows = requirements.map((requirement) => {
    const skill = declared.get(requirement.normalizedName);
    const canonicalSkill = canonical.get(requirement.normalizedName);
    const threshold = skill?.passThreshold ?? PASS_THRESHOLD;
    const assessmentPassed = skill?.assessmentPassed === true || (skill?.assessmentPassed == null && skill?.assessedScore != null && skill.assessedScore >= threshold);
    const verifiedProject = skill?.projectEvidence.some((evidence) => evidence.status === "VERIFIED" && evidence.project.verificationStatus === "VERIFIED") || false;
    const externallyVerified = !!canonicalSkill && canonicalSkill.verificationStatus !== EvidenceVerificationStatus.UNVERIFIED && canonicalSkill.verificationStatus !== EvidenceVerificationStatus.SELF_ATTESTED;
    const hasPassingEvidence = assessmentPassed || verifiedProject || externallyVerified;
    const candidateLevel = scoreToProficiency(skill?.assessedScore ?? canonicalSkill?.assessedScore ?? null) || skill?.claimedProficiency || canonicalSkill?.claimedProficiency || null;
    const proficiencyRatio = hasPassingEvidence && candidateLevel ? Math.min(1, proficiencyRank[candidateLevel] / proficiencyRank[requirement.requiredLevel]) : 0;
    const weightRatio = Math.max(0.1, requirement.weight) / totalRequirementWeight;
    if (hasPassingEvidence) coverage += weightRatio;
    proficiency += weightRatio * proficiencyRatio;
    if (verifiedProject || externallyVerified) verifiedEvidence += weightRatio;
    const status = !hasPassingEvidence ? "GAP" : proficiencyRatio < 1 ? "PARTIAL" : "MATCH";
    return {
      skillId: requirement.id,
      skill: requirement.name,
      requiredProficiency: requirement.requiredLevel,
      candidateProficiency: candidateLevel,
      mandatory: requirement.mandatory,
      weight: requirement.weight,
      assessmentScore: skill?.assessedScore ?? canonicalSkill?.assessedScore ?? null,
      assessmentPassed,
      projectVerified: verifiedProject,
      evidenceStatus: externallyVerified ? canonicalSkill!.verificationStatus : verifiedProject ? "PROJECT_VERIFIED" : assessmentPassed ? "ASSESSMENT_PASSED" : "UNVERIFIED",
      status,
      explanation: status === "GAP" ? "No passing or verified evidence is available." : status === "PARTIAL" ? `Evidence exists, but ${candidateLevel} is below ${requirement.requiredLevel}.` : `${requirement.requiredLevel} requirement is supported by passing evidence.`,
    };
  });

  const candidateYears = extractYears(profile.experienceSummary);
  const experience = job.minExperience === 0 ? 1 : candidateYears == null ? 0 : Math.min(1, candidateYears / job.minExperience);
  const qualification = !job.qualification ? 1 : profile.qualification && normalizeSkillName(profile.qualification).includes(normalizeSkillName(job.qualification)) ? 1 : 0;
  const components = {
    skillCoverage: Math.round(coverage * MATCH_WEIGHTS.coverage * 100) / 100,
    proficiency: Math.round(proficiency * MATCH_WEIGHTS.proficiency * 100) / 100,
    verifiedEvidence: Math.round(verifiedEvidence * MATCH_WEIGHTS.verifiedEvidence * 100) / 100,
    experience: Math.round(experience * MATCH_WEIGHTS.experience * 100) / 100,
    qualification: qualification * MATCH_WEIGHTS.qualification,
  };
  const score = Math.round(Object.values(components).reduce((sum, value) => sum + value, 0) * 100) / 100;
  return { job, rows, score, components, weights: MATCH_WEIGHTS, insufficientEvidence: false, method: "Transparent weighted match from canonical job skills and candidate evidence." };
}
