import { CareerDiscoveryRecommendation, CareerFitClassification } from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";

export const careerDiscoveryService = {
  async discoverCareers(candidateId = "user-cand-01"): Promise<CareerDiscoveryRecommendation[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const candidateSkillIds = new Set((candidate.skills || []).map((s) => s.skillId));

    const roles = await roleRepository.findAll();
    const results: CareerDiscoveryRecommendation[] = [];

    for (const role of roles) {
      const required = role.coreSkills || [];
      const totalReq = required.length || 1;

      const matchingSkills: string[] = [];
      const missingSkills: string[] = [];

      for (const req of required) {
        const sName = (req as any).skillName || (req as any).name || "Core Skill";
        if (candidateSkillIds.has(req.skillId)) {
          matchingSkills.push(sName);
        } else {
          missingSkills.push(sName);
        }
      }

      const matchRatio = matchingSkills.length / totalReq;
      const fitScore = Math.round(matchRatio * 100);

      let fitClassification: CareerFitClassification = "ADJACENT_CAREER";
      if (matchRatio >= 0.75) fitClassification = "BEST_FIT";
      else if (matchRatio >= 0.50) fitClassification = "STRONG_FIT";
      else if ((role as any).isEmerging) fitClassification = "EMERGING_OPPORTUNITY";
      else if (matchRatio >= 0.25) fitClassification = "CAREER_TRANSITION";

      const demands = await demandSignalRepository.findAll({ roleId: role.id });
      const annualDemandVolume = demands.reduce((sum, d) => sum + (d.normalizedVolume || 100), 0) || 1650;

      const rationale = `Recommended as ${fitClassification.replace(/_/g, " ")}: You match ${matchingSkills.length} of ${totalReq} required skills (${matchingSkills.slice(0, 2).join(", ")}). Strong hiring demand with ${annualDemandVolume} openings in target industrial corridors.`;

      results.push({
        roleId: role.id,
        roleTitle: role.title,
        industryId: role.sectorId || "ind-auto-ev",
        industryName: (role as any).sector || role.sectorId || "Automotive & EV",
        fitClassification,
        fitScore,
        matchingSkillsCount: matchingSkills.length,
        totalRequiredSkillsCount: totalReq,
        topMatchingSkills: matchingSkills,
        missingKeySkills: missingSkills,
        annualDemandVolume,
        salaryRangeINR: (role as any).salaryRangeINR || { min: 600000, max: 1200000 },
        rationale,
        confidence: 0.94,
      });
    }

    results.sort((a, b) => b.fitScore - a.fitScore);
    return results;
  },
};
