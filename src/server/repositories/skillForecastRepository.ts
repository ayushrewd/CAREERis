// ==============================================================================
// CAREERIS SKILL FORECAST REPOSITORY
// Predictive Skill Diffusion, Adoption Curves & Obsolescence Registry
// ==============================================================================

import {
  SkillDemandForecast,
  FutureSkillBundle,
} from "@/types/predictiveIntelligence";
import {
  CANONICAL_SKILL_FORECASTS,
  CANONICAL_FUTURE_SKILL_BUNDLES,
} from "@/data/canonicalForecastData";

let inMemorySkillForecasts: Record<string, SkillDemandForecast> = JSON.parse(
  JSON.stringify(CANONICAL_SKILL_FORECASTS)
);
let inMemoryBundles: FutureSkillBundle[] = JSON.parse(
  JSON.stringify(CANONICAL_FUTURE_SKILL_BUNDLES)
);

export const skillForecastRepository = {
  async getForecastBySkillId(skillId: string): Promise<SkillDemandForecast | null> {
    const found = inMemorySkillForecasts[skillId];
    if (found) return JSON.parse(JSON.stringify(found));

    // Generate fallback forecast
    return {
      skillId,
      skillName: `Skill (${skillId})`,
      categoryName: "General Industry",
      currentAnnualDemand: 5000,
      projectedAnnualDemand: 6500,
      growthRatePercentage: 30.0,
      adoptionStage: "EARLY_ADOPTION",
      employerAdoptionVelocity: 75,
      crossIndustryDiffusionIndex: 70,
      trainingSupplyLagMonths: 6,
      projections: [
        { date: "2026-04", projectedDemand: 5400, lowerConfidenceBound: 5100, upperConfidenceBound: 5700, confidenceScore: 0.94 },
        { date: "2026-07", projectedDemand: 5800, lowerConfidenceBound: 5400, upperConfidenceBound: 6200, confidenceScore: 0.91 },
        { date: "2026-10", projectedDemand: 6150, lowerConfidenceBound: 5700, upperConfidenceBound: 6600, confidenceScore: 0.88 },
        { date: "2027-01", projectedDemand: 6500, lowerConfidenceBound: 5900, upperConfidenceBound: 7100, confidenceScore: 0.85 },
      ],
      obsolescenceRisk: {
        level: "LOW_RISK",
        signals: ["Stable demand trend across industrial clusters."],
        potentialSubstitutes: [],
      },
      adjacentSkills: [],
      forecastConfidence: 0.90,
    };
  },

  async getAllEmergingSkills(): Promise<SkillDemandForecast[]> {
    return Object.values(inMemorySkillForecasts).filter(
      (s) => s.adoptionStage === "ACCELERATION" || s.adoptionStage === "EARLY_ADOPTION"
    );
  },

  async getAllObsolescenceRisks(): Promise<SkillDemandForecast[]> {
    return Object.values(inMemorySkillForecasts).filter(
      (s) => s.obsolescenceRisk.level === "HIGH_RISK" || s.obsolescenceRisk.level === "CRITICAL"
    );
  },

  async getFutureSkillBundles(): Promise<FutureSkillBundle[]> {
    return JSON.parse(JSON.stringify(inMemoryBundles));
  },
};
