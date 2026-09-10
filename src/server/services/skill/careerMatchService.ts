import { candidateRepository } from "@/server/repositories/candidateRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { ExplainableMatchBreakdown } from "@/types/skills";
import { skillEvidenceScoringService } from "./skillEvidenceScoringService";

const PROFICIENCY_SCORES: Record<string, number> = {
  FOUNDATIONAL: 40,
  INTERMEDIATE: 65,
  ADVANCED: 85,
  EXPERT: 100,
};

export interface JobMatchResult {
  jobId: string;
  jobTitle: string;
  companyName: string;
  district: string;
  state: string;
  salaryRangeINR: { min: number; max: number };
  matchBreakdown: ExplainableMatchBreakdown;
}

export const careerMatchService = {
  async matchCandidateToJob(candidateId: string, jobId: string): Promise<JobMatchResult> {
    const candidate = await candidateRepository.getProfile(candidateId);
    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const requiredSkills = job.requiredSkills || [];
    let matchedSkillsCount = 0;
    let proficiencyFitSum = 0;
    let evidenceQualitySum = 0;

    const strengths: Array<{ skillName: string; detail: string }> = [];
    const partialMatches: Array<{ skillName: string; current: string; required: string }> = [];
    const missingSkills: Array<{ skillName: string; importance: string }> = [];
    const recommendedActions: string[] = [];

    for (const req of requiredSkills) {
      const candSkill = candidate.skills.find(
        (cs) => cs.skillId === req.skillId || cs.skillName.toLowerCase() === req.name.toLowerCase()
      );

      if (candSkill) {
        matchedSkillsCount++;
        const candProfScore = PROFICIENCY_SCORES[candSkill.claimedProficiency || "FOUNDATIONAL"] || 40;
        const reqProfScore = PROFICIENCY_SCORES[req.level || "INTERMEDIATE"] || 65;

        const profFit = Math.min(100, (candProfScore / reqProfScore) * 100);
        proficiencyFitSum += profFit;

        const evidence = skillEvidenceScoringService.scoreCandidateSkill({
          skillId: req.skillId,
          skillName: req.name,
          claimedProficiency: candSkill.claimedProficiency as any,
          assessedScore: candSkill.assessedScore,
          verificationStatus: candSkill.verificationStatus,
        });

        evidenceQualitySum += evidence.confidenceScore * 100;

        if (candProfScore >= reqProfScore) {
          strengths.push({
            skillName: req.name,
            detail: `Verified ${candSkill.claimedProficiency} (Score: ${evidence.calculatedScore}%) exceeds required ${req.level}.`,
          });
        } else {
          partialMatches.push({
            skillName: req.name,
            current: candSkill.claimedProficiency || "FOUNDATIONAL",
            required: req.level || "INTERMEDIATE",
          });
          recommendedActions.push(`Take advanced assessment in ${req.name} to demonstrate higher proficiency.`);
        }
      } else {
        missingSkills.push({
          skillName: req.name,
          importance: req.isMandatory ? "CRITICAL MANDATORY" : "PREFERRED",
        });
        recommendedActions.push(`Enroll in modular training course covering ${req.name}.`);
      }
    }

    const skillCoverageScore = requiredSkills.length > 0 ? Math.round((matchedSkillsCount / requiredSkills.length) * 100) : 100;
    const proficiencyFitScore = matchedSkillsCount > 0 ? Math.round(proficiencyFitSum / matchedSkillsCount) : 0;
    const evidenceQualityScore = matchedSkillsCount > 0 ? Math.round(evidenceQualitySum / matchedSkillsCount) : 0;

    // Experience score
    const totalExpYears = candidate.experience?.length || 1;
    const reqExpYears = job.minExperience || 0;
    const experienceScore = Math.min(100, Math.round((totalExpYears / Math.max(1, reqExpYears)) * 100));

    // Location score
    let locationScore = 60;
    if (candidate.currentDistrict && job.district && candidate.currentDistrict.toLowerCase() === job.district.toLowerCase()) {
      locationScore = 100;
    } else if (candidate.currentState && candidate.currentState.toLowerCase() === job.state.toLowerCase()) {
      locationScore = 85;
    }

    // Weighted Overall Score (40% Coverage, 25% Proficiency, 15% Evidence, 10% Experience, 10% Location)
    const overallScore = Math.round(
      skillCoverageScore * 0.40 +
      proficiencyFitScore * 0.25 +
      evidenceQualityScore * 0.15 +
      experienceScore * 0.10 +
      locationScore * 0.10
    );

    return {
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      district: job.district,
      state: job.state,
      salaryRangeINR: job.salaryRangeINR || { min: 600000, max: 1200000 },
      matchBreakdown: {
        overallScore,
        factorBreakdown: {
          skillCoverageScore,
          proficiencyFitScore,
          evidenceQualityScore,
          experienceScore,
          locationScore,
        },
        strengths,
        partialMatches,
        missingSkills,
        recommendedActions,
      },
    };
  },
};
