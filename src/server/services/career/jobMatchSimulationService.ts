import { MatchSimulationResult } from "@/types/careerJourney";
import { jobRepository } from "@/server/repositories/jobRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";

export const jobMatchSimulationService = {
  async simulateSkillAddition(
    jobId: string,
    skillId: string,
    proficiency = "ADVANCED",
    candidateId = "user-cand-01"
  ): Promise<MatchSimulationResult> {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;

    const requiredSkills = job.requiredSkills || [];
    const totalReq = requiredSkills.length || 1;

    // Baseline calculation
    let currentMatched = 0;
    for (const req of requiredSkills) {
      if ((candidate.skills || []).some((cs) => cs.skillId === req.skillId)) {
        currentMatched++;
      }
    }
    const currentMatchScore = Math.round((currentMatched / totalReq) * 100);

    // Projected calculation with new skill added
    const isRelevantToJob = requiredSkills.some((req) => req.skillId === skillId);
    const projectedMatched = isRelevantToJob ? currentMatched + 1 : currentMatched;
    const projectedMatchScore = Math.min(100, Math.round((projectedMatched / totalReq) * 100));
    const matchScoreDelta = projectedMatchScore - currentMatchScore;

    const reason = isRelevantToJob
      ? `Adding '${skillName}' directly satisfies a core mandatory requirement for '${job.title}', increasing your candidate ranking from ${currentMatchScore}% to ${projectedMatchScore}%.`
      : `Skill '${skillName}' is a valuable adjacent competency that strengthens overall engineering capability.`;

    return {
      label: "SIMULATION",
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      currentMatchScore,
      simulatedSkillAdded: {
        skillId,
        skillName,
        proficiency,
      },
      projectedMatchScore,
      matchScoreDelta,
      reason,
      confidence: 0.94,
      caveat: "SIMULATION ONLY: Actual interview shortlist decisions also depend on employer hiring volume and assessment score thresholds.",
    };
  },
};
