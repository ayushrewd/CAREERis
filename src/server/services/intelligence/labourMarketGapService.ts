import { LabourMarketGapResult, MarketTightness } from "@/types/intelligence";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";
import { supplyAggregationService } from "./supplyAggregationService";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";

export function calculateMarketTightness(demand: number, supply: number): MarketTightness {
  if (!demand || !supply || supply === 0) {
    return demand > 0 ? "VERY_TIGHT" : "INSUFFICIENT_DATA";
  }
  const ratio = demand / supply;
  if (ratio >= 2.5) return "VERY_TIGHT";
  if (ratio >= 1.5) return "TIGHT";
  if (ratio >= 0.8) return "BALANCED";
  return "SURPLUS";
}

export const labourMarketGapService = {
  async calculateSkillGap(skillId: string, geography?: { stateCode?: string; districtId?: string; period?: string }): Promise<LabourMarketGapResult> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;
    const category = skill ? skill.categoryName : "General Technical";

    // 1. Demand Signals
    const demands = await demandSignalRepository.findAll({
      skillId,
      stateCode: geography?.stateCode,
      districtId: geography?.districtId,
      period: geography?.period,
    });

    const totalDemand = demands.reduce((sum, d) => sum + (d.normalizedVolume || d.volume || 100), 0) || (skill?.isEmerging ? 2100 : 1400);

    // 2. Supply Breakdown
    const supplyTier = await supplyAggregationService.getSupplyBySkill(skillId, geography);
    const availableSupply = supplyTier.availableWorkforce || 300;
    const learningPipeline = supplyTier.learningSupply || 500;

    // 3. Gap & Tightness Calculation
    const netGap = Math.max(0, totalDemand - availableSupply);
    const gapRatio = Number((totalDemand / Math.max(1, availableSupply)).toFixed(2));
    const marketTightness = calculateMarketTightness(totalDemand, availableSupply);
    const gapPercentage = Math.round((netGap / Math.max(1, totalDemand)) * 100);

    const drivers: string[] = [];
    if (gapRatio > 3.0) drivers.push("Severe enterprise expansion outstripping local vocational seat capacity");
    if (supplyTier.verifiedSkillSupply < supplyTier.certifiedSupply * 0.6) drivers.push("Significant drop-off between vocational course completion and proctored assessment verification");
    if (skill?.isEmerging) drivers.push("Rapidly emerging technology standard with curriculum lag in non-CoE ITIs");

    return {
      skillId,
      skillName,
      category,
      stateCode: geography?.stateCode || "IN",
      districtId: geography?.districtId,
      period: geography?.period || "2026-Q2",
      annualEmployerDemand: totalDemand,
      availableVerifiedSupply: availableSupply,
      learningPipelineSupply: learningPipeline,
      netGap,
      gapRatio,
      marketTightness,
      gapPercentage,
      confidence: 0.95,
      trend: netGap > 1000 ? "RISING_DEFICIT" : "STABLE",
      primaryDrivers: drivers.length > 0 ? drivers : ["Balanced market equilibrium across registered clusters"],
    };
  },

  async getAllRegionalGaps(params?: { stateCode?: string; districtId?: string }): Promise<LabourMarketGapResult[]> {
    const skillsRes = await skillGraphRepository.findAll({ pageSize: 50 });
    const results: LabourMarketGapResult[] = [];

    for (const skill of skillsRes.items) {
      const gap = await this.calculateSkillGap(skill.id, params);
      results.push(gap);
    }

    results.sort((a, b) => b.netGap - a.netGap);
    return results;
  },
};
