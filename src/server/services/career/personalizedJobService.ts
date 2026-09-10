import { PersonalizedJobOpportunity } from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { applicationRepository } from "@/server/repositories/applicationRepository";

export const personalizedJobService = {
  async getRecommendedJobs(candidateId = "user-cand-01", filterCategory?: string): Promise<PersonalizedJobOpportunity[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const candidateSkillMap = new Map((candidate.skills || []).map((s) => [s.skillId, s]));

    const jobsRes = await jobRepository.findAll({ pageSize: 30 });
    const applications = await applicationRepository.findByCandidateId(candidate.id);
    const appliedJobIds = new Set(applications.map((a) => a.jobId));

    const results: PersonalizedJobOpportunity[] = [];

    for (const job of jobsRes.items) {
      const requiredSkills = job.requiredSkills || [];
      const totalReq = requiredSkills.length || 1;

      const matchedSkills: Array<{ skillId: string; skillName: string }> = [];
      const missingSkills: Array<{ skillId: string; skillName: string; isMandatory: boolean }> = [];

      let matchedWeight = 0;
      let totalWeight = 0;

      for (const req of requiredSkills) {
        const weight = req.isMandatory ? 2 : 1;
        totalWeight += weight;

        const candSkill = candidateSkillMap.get(req.skillId);
        if (candSkill) {
          matchedSkills.push({ skillId: req.skillId, skillName: req.name });
          const profMultiplier = (candSkill.claimedProficiency === "ADVANCED" || candSkill.claimedProficiency === "EXPERT") ? 1.0 : 0.75;
          matchedWeight += weight * profMultiplier;
        } else {
          missingSkills.push({ skillId: req.skillId, skillName: req.name, isMandatory: req.isMandatory });
        }
      }

      const matchScore = Math.min(100, Math.round((matchedWeight / Math.max(1, totalWeight)) * 100));
      const isNearby = job.district.toLowerCase() === candidate.currentDistrict.toLowerCase();

      let category: PersonalizedJobOpportunity["category"] = "EXPERIENCED";
      if (matchScore >= 80) category = "BEST_MATCH";
      else if (isNearby) category = "NEARBY";
      else if (job.jobType === "REMOTE" || job.jobType === "HYBRID") category = "REMOTE";
      else if (missingSkills.length > 0 && matchScore >= 50) category = "SKILL_GAP_OPPORTUNITIES";
      else if (job.minExperience <= 1) category = "ENTRY_LEVEL";

      const whyYouMatch = matchedSkills.length > 0
        ? `You possess ${matchedSkills.length} of ${totalReq} required competencies (${matchedSkills.map((s) => s.skillName).slice(0, 2).join(", ")}).`
        : "Foundational technical alignment based on trade qualification.";

      const whatIsMissing = missingSkills.length > 0
        ? `Missing competencies: ${missingSkills.map((s) => s.skillName).join(", ")}.`
        : "All core technical competencies met.";

      results.push({
        jobId: job.id,
        jobTitle: job.title,
        companyId: job.companyId,
        companyName: job.companyName,
        district: job.district,
        state: job.state,
        salaryRangeINR: job.salaryRangeINR || { min: 500000, max: 1000000 },
        category,
        matchScore,
        skillCoverageScore: Math.round((matchedSkills.length / totalReq) * 100),
        proficiencyScore: matchScore >= 75 ? 88 : 65,
        evidenceScore: (candidate.skills || []).some((s) => s.verificationStatus === "VERIFIED") ? 90 : 40,
        experienceAlignmentScore: 85,
        matchedSkills,
        missingSkills,
        whyYouMatch,
        whatIsMissing,
        isApplied: appliedJobIds.has(job.id),
      });
    }

    results.sort((a, b) => b.matchScore - a.matchScore);

    if (filterCategory) {
      return results.filter((j) => j.category === filterCategory);
    }
    return results;
  },
};
