// ==============================================================================
// CAREERIS TALENT INTELLIGENCE SERVICE
// Regional Talent Availability Radar, Skill Shortage & Hiring Difficulty Index
// ==============================================================================

import { CANONICAL_TALENT_MAP, CANONICAL_SKILL_SHORTAGES } from "@/data/canonicalWorkforcePlansData";
import { TalentAvailabilityMapItem, SkillShortageInsight, HiringDifficultyCategory } from "@/types/employerIntelligence";

export const talentIntelligenceService = {
  async getTalentAvailabilityMap(params?: {
    scope?: "STATE" | "DISTRICT" | "CLUSTER";
    skillId?: string;
  }): Promise<TalentAvailabilityMapItem[]> {
    let list = [...CANONICAL_TALENT_MAP];
    if (params?.scope) {
      list = list.filter((item) => item.geographyScope === params.scope);
    }
    return list;
  },

  async getSkillShortages(params?: { skillId?: string }): Promise<SkillShortageInsight[]> {
    let list = [...CANONICAL_SKILL_SHORTAGES];
    if (params?.skillId) {
      list = list.filter((s) => s.skillId.toLowerCase() === params.skillId!.toLowerCase());
    }
    return list;
  },

  async calculateHiringDifficulty(params: {
    skillId: string;
    district?: string;
    requiredProficiency?: string;
    openingsCount?: number;
  }): Promise<{
    skillId: string;
    skillName: string;
    difficultyCategory: HiringDifficultyCategory;
    difficultyScore: number; // 0 - 100
    demandSupplyRatio: number;
    estimatedTimeToHireDays: number;
    reasons: string[];
    mitigationStrategy: string;
  }> {
    const shortage = CANONICAL_SKILL_SHORTAGES.find((s) => s.skillId === params.skillId) || CANONICAL_SKILL_SHORTAGES[0];

    let difficultyScore = 78;
    let difficultyCategory: HiringDifficultyCategory = "HIGH";

    if (shortage.demandSupplyRatio > 3.5) {
      difficultyScore = 92;
      difficultyCategory = "VERY_HIGH";
    } else if (shortage.demandSupplyRatio > 2.0) {
      difficultyScore = 74;
      difficultyCategory = "HIGH";
    } else if (shortage.demandSupplyRatio > 1.2) {
      difficultyScore = 55;
      difficultyCategory = "MODERATE";
    } else {
      difficultyScore = 32;
      difficultyCategory = "LOW";
    }

    const reasons = [
      `Regional annual demand (${shortage.annualRegionalDemand}) outpaces verified supply (${shortage.verifiedTalentSupply}) by ${shortage.demandSupplyRatio.toFixed(1)}x.`,
      shortage.isEmerging ? "Identified as an Emerging Next-Gen Skill with rapid industry adoption." : "Established high-precision domain competency.",
      `Estimated regional time-to-hire is ${shortage.averageTimeToHireDays} days.`,
    ];

    const mitigationStrategy = difficultyCategory === "VERY_HIGH" || difficultyCategory === "HIGH"
      ? "Establish a Sponsored CoE Training-to-Hire pipeline with local ITIs (e.g. ITI Aundh) to secure pre-qualified talent cohorts."
      : "Standard recruiter pipeline with automated Skill Passport screening is sufficient.";

    return {
      skillId: shortage.skillId,
      skillName: shortage.skillName,
      difficultyCategory,
      difficultyScore,
      demandSupplyRatio: shortage.demandSupplyRatio,
      estimatedTimeToHireDays: shortage.averageTimeToHireDays,
      reasons,
      mitigationStrategy,
    };
  },
};
