// ==============================================================================
// CAREERIS EMPLOYER TALENT SCARCITY SERVICE
// Predictive Talent Scarcity, Hiring Velocity & Supply-Demand Future Gaps
// ==============================================================================

import { TalentScarcityForecast } from "@/types/predictiveIntelligence";

const CANONICAL_TALENT_SCARCITY: TalentScarcityForecast[] = [
  {
    industry: "Automotive & EV",
    districtName: "Pune",
    stateCode: "MH",
    hiringDifficultyIndex: 88,
    marketCondition: "CRITICAL_SHORTAGE",
    projected12MDemand: 48000,
    projected12MSupply: 16500,
    netProjectedDeficit: 31500,
    scarceSkills: [
      { skillName: "Battery Management Systems (BMS)", hiringTimeWeeks: 10, wageInflationPremiumYoY: 28.5 },
      { skillName: "High-Voltage Safety Norms", hiringTimeWeeks: 8, wageInflationPremiumYoY: 22.0 },
    ],
  },
  {
    industry: "Precision Manufacturing",
    districtName: "Bengaluru Urban",
    stateCode: "KA",
    hiringDifficultyIndex: 78,
    marketCondition: "MODERATE_SHORTAGE",
    projected12MDemand: 32000,
    projected12MSupply: 18000,
    netProjectedDeficit: 14000,
    scarceSkills: [
      { skillName: "5-Axis CNC Precision Machining", hiringTimeWeeks: 7, wageInflationPremiumYoY: 18.0 },
    ],
  },
];

export const employerTalentScarcityService = {
  async getTalentScarcityOverview(params?: { industry?: string; districtName?: string }): Promise<TalentScarcityForecast[]> {
    let list = [...CANONICAL_TALENT_SCARCITY];
    if (params?.industry) {
      list = list.filter((s) => s.industry.toLowerCase().includes(params.industry!.toLowerCase()));
    }
    if (params?.districtName) {
      list = list.filter((s) => s.districtName.toLowerCase() === params.districtName!.toLowerCase());
    }
    return list;
  },

  async getFutureSupplyDemandGap(skillId: string = "skill-bms") {
    return {
      skillId,
      skillName: "Battery Management Systems (BMS)",
      forecast12MDemand: 38400,
      forecast12MSupplyTiers: {
        learningInInstitutes: 12000,
        certifiedGraduates: 9500,
        skillPassportVerified: 7800,
        activelyAvailableForHiring: 6200,
        placedInApprenticeships: 3100,
      },
      effectiveAvailableSupply: 6200,
      projectedNetGap: 32200,
      gapSeverity: "CRITICAL_DEFICIT",
      recommendedAction: "Subsidize 25 additional Center of Excellence EV labs across western automotive corridor.",
    };
  },
};
