import { SupplyBreakdownByTier } from "@/types/intelligence";
import { CANONICAL_SUPPLY_TIERS } from "@/data/canonicalLabourMarketData";
import { courseRepository } from "@/server/repositories/courseRepository";

let inMemorySupplyTiers: SupplyBreakdownByTier[] = JSON.parse(JSON.stringify(CANONICAL_SUPPLY_TIERS));

export const supplyAggregationService = {
  async getSupplyBySkill(skillId: string, geography?: { stateCode?: string; districtId?: string }): Promise<SupplyBreakdownByTier> {
    const matched = inMemorySupplyTiers.find((s) => {
      const matchSkill = s.skillId === skillId;
      if (!matchSkill) return false;
      if (geography?.districtId) return s.districtId === geography.districtId;
      if (geography?.stateCode) return s.stateCode === geography.stateCode;
      return true;
    });

    if (matched) {
      return JSON.parse(JSON.stringify(matched));
    }

    // Default pan-India tier estimation for other competencies
    const coursesRes = await courseRepository.findAll({ search: skillId });
    const capacitySeats = coursesRes.items.reduce((sum, c) => sum + (c.capacity || 40), 0) || 120;

    return {
      skillId,
      skillName: skillId,
      stateCode: geography?.stateCode || "IN",
      districtId: geography?.districtId,
      period: "2026-Q2",
      potentialSupply: capacitySeats * 4,
      learningSupply: Math.round(capacitySeats * 0.9),
      certifiedSupply: Math.round(capacitySeats * 0.75),
      verifiedSkillSupply: Math.round(capacitySeats * 0.5),
      availableWorkforce: Math.round(capacitySeats * 0.4),
      placedWorkforce: Math.round(capacitySeats * 0.3),
      totalEffectiveSupply: Math.round(capacitySeats * 0.4),
      confidence: 0.91,
    };
  },

  async getAllSupplyRecords(): Promise<SupplyBreakdownByTier[]> {
    return [...inMemorySupplyTiers];
  },
};
