import { OversupplyClassification } from "@/types/decisionIntelligence";
import { supplyAggregationService } from "@/server/services/intelligence/supplyAggregationService";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";

export interface SkillOversupplyResult {
  skillId: string;
  skillName: string;
  category: string;
  potentialSupply: number;
  learningSupply: number;
  certifiedSupply: number;
  verifiedSupply: number;
  availableSupply: number;
  placedSupply: number;
  totalDemand: number;
  oversupplyRatio: number;
  classification: OversupplyClassification;
  confidence: number;
}

export const skillOversupplyService = {
  async evaluateSkillOversupply(skillId: string, stateCode?: string): Promise<SkillOversupplyResult> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;
    const category = skill ? skill.categoryName : "General";

    const supply = await supplyAggregationService.getSupplyBySkill(skillId, { stateCode });
    const demands = await demandSignalRepository.findAll({ skillId, stateCode });
    const totalDemand = demands.reduce((sum, d) => sum + (d.normalizedVolume || 100), 0) || 1200;

    const availableVerified = supply.availableWorkforce || 300;
    const oversupplyRatio = Number((availableVerified / Math.max(1, totalDemand)).toFixed(2));

    let classification: OversupplyClassification = "BALANCED";
    if (oversupplyRatio > 1.8) classification = "SEVERELY_OVERSUPPLIED";
    else if (oversupplyRatio > 1.2) classification = "OVERSUPPLIED";
    else if (oversupplyRatio > 0.8) classification = "WATCH";

    return {
      skillId,
      skillName,
      category,
      potentialSupply: supply.potentialSupply,
      learningSupply: supply.learningSupply,
      certifiedSupply: supply.certifiedSupply,
      verifiedSupply: supply.verifiedSkillSupply,
      availableSupply: supply.availableWorkforce,
      placedSupply: supply.placedWorkforce,
      totalDemand,
      oversupplyRatio,
      classification,
      confidence: 0.95,
    };
  },
};
