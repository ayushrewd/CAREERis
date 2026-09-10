// ==============================================================================
// CAREERIS SKILL PREDICTION SERVICE
// Emerging Skill Curves, Obsolescence Radar, Substitution & Skill Bundles
// ==============================================================================

import { skillForecastRepository } from "@/server/repositories/skillForecastRepository";
import {
  SkillDemandForecast,
  FutureSkillBundle,
} from "@/types/predictiveIntelligence";

export const skillPredictionService = {
  async getSkillForecast(skillId: string): Promise<SkillDemandForecast | null> {
    return skillForecastRepository.getForecastBySkillId(skillId);
  },

  async getEmergingSkills(): Promise<SkillDemandForecast[]> {
    return skillForecastRepository.getAllEmergingSkills();
  },

  async getObsolescenceRisks(): Promise<SkillDemandForecast[]> {
    return skillForecastRepository.getAllObsolescenceRisks();
  },

  async getFutureSkillBundles(): Promise<FutureSkillBundle[]> {
    return skillForecastRepository.getFutureSkillBundles();
  },

  async getSkillSubstitutionAnalysis(skillId: string) {
    const fc = await this.getSkillForecast(skillId);
    if (!fc) return null;

    return {
      sourceSkill: fc.skillName,
      obsolescenceRisk: fc.obsolescenceRisk.level,
      signals: fc.obsolescenceRisk.signals,
      substitutes: fc.obsolescenceRisk.potentialSubstitutes,
      adjacentSkills: fc.adjacentSkills,
      recommendation:
        fc.obsolescenceRisk.level === "CRITICAL"
          ? "Modernize active training syllabi into automated substitutes immediately."
          : "Maintain core curriculum while expanding adjacent digital competencies.",
      confidence: fc.forecastConfidence,
    };
  },
};
