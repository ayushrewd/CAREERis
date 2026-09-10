import { candidateRepository } from "@/server/repositories/candidateRepository";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { skillTrendService } from "@/server/services/intelligence/skillTrendService";
import { emergingSkillService } from "@/server/services/intelligence/emergingSkillService";

export interface PersonalizedMarketSignal {
  skillId: string;
  skillName: string;
  isOwnedByCandidate: boolean;
  marketTightness: string;
  annualEmployerDemand: number;
  growthRatePct: number;
  trendClassification: string;
  isEmerging: boolean;
  emergingScore?: number;
  personalRelevanceSummary: string;
}

export const personalizedMarketService = {
  async getPersonalizedSignals(candidateId = "user-cand-01"): Promise<PersonalizedMarketSignal[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const candidateSkillIds = new Set((candidate.skills || []).map((s) => s.skillId));

    const targetSkills = ["skill-bms", "skill-can", "skill-plc", "skill-ros"];
    const results: PersonalizedMarketSignal[] = [];

    for (const skillId of targetSkills) {
      const isOwned = candidateSkillIds.has(skillId);
      const gap = await labourMarketGapService.calculateSkillGap(skillId);
      const trend = await skillTrendService.getSkillTrend(skillId);
      const emergingList = await emergingSkillService.getEmergingSkills();
      const emergingMetric = emergingList.find((e) => e.skillId === skillId);

      let personalRelevanceSummary = "";
      if (isOwned) {
        personalRelevanceSummary = `Your verified skill '${gap.skillName}' aligns with ${gap.marketTightness} market demand (+${trend.growthRatePct}% YoY) in ${candidate.currentDistrict}.`;
      } else {
        personalRelevanceSummary = `Acquiring '${gap.skillName}' unlocks ${gap.annualEmployerDemand} annual vacancies across target automotive and automation plants.`;
      }

      results.push({
        skillId,
        skillName: gap.skillName,
        isOwnedByCandidate: isOwned,
        marketTightness: gap.marketTightness,
        annualEmployerDemand: gap.annualEmployerDemand,
        growthRatePct: trend.growthRatePct,
        trendClassification: trend.trendClassification,
        isEmerging: !!emergingMetric,
        emergingScore: emergingMetric?.emergingScore,
        personalRelevanceSummary,
      });
    }

    return results;
  },
};
