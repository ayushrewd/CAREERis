// ==============================================================================
// CAREERIS POLICY PRIORITY SERVICE
// Time-Windowed National, State & District Skill Priority Lists
// ==============================================================================

import { policyRecommendationRepository } from "@/server/repositories/policyRecommendationRepository";
import { PolicyRecommendation } from "@/types/governmentIntelligence";

export interface SkillPriorityItem {
  skillId: string;
  skillName: string;
  category: "CRITICAL_SHORTAGE" | "HIGH_GROWTH" | "EMERGING" | "STRATEGIC" | "GREEN" | "DIGITAL" | "INDUSTRIAL";
  nationalDemandRank: number;
  demandSupplyRatio: number;
  annualNationalDemand: number;
  annualVerifiedSupply: number;
  growthRateYoYPercentage: number;
  leadingStates: string[];
  recommendedPolicyAction: string;
}

const PAN_INDIA_SKILL_PRIORITIES: SkillPriorityItem[] = [
  {
    skillId: "skill-bms",
    skillName: "Battery Management Systems (BMS)",
    category: "CRITICAL_SHORTAGE",
    nationalDemandRank: 1,
    demandSupplyRatio: 4.6,
    annualNationalDemand: 38000,
    annualVerifiedSupply: 8200,
    growthRateYoYPercentage: 68.4,
    leadingStates: ["Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat"],
    recommendedPolicyAction: "Mandate sponsored OEM CoE apprenticeships under NAPS and sanction high-voltage lab equipment grants.",
  },
  {
    skillId: "skill-5axis-cnc",
    skillName: "5-Axis CNC Precision Machining",
    category: "INDUSTRIAL",
    nationalDemandRank: 2,
    demandSupplyRatio: 2.4,
    annualNationalDemand: 65000,
    annualVerifiedSupply: 27000,
    growthRateYoYPercentage: 24.2,
    leadingStates: ["Maharashtra", "Gujarat", "Tamil Nadu", "Haryana"],
    recommendedPolicyAction: "Expand STRIVE World Bank lab modernization to 120 additional ITIs.",
  },
  {
    skillId: "skill-ai-edge",
    skillName: "Edge AI & Embedded Firmware",
    category: "DIGITAL",
    nationalDemandRank: 3,
    demandSupplyRatio: 3.2,
    annualNationalDemand: 42000,
    annualVerifiedSupply: 13000,
    growthRateYoYPercentage: 54.0,
    leadingStates: ["Karnataka", "Telangana", "Maharashtra", "Tamil Nadu"],
    recommendedPolicyAction: "Institute state micro-credentials and equip polytechnic test benches with Vector CAN & RTOS suites.",
  },
  {
    skillId: "skill-green-h2",
    skillName: "Green Hydrogen Electrolyzer Operations",
    category: "GREEN",
    nationalDemandRank: 4,
    demandSupplyRatio: 5.1,
    annualNationalDemand: 12000,
    annualVerifiedSupply: 2300,
    growthRateYoYPercentage: 92.0,
    leadingStates: ["Gujarat", "Rajasthan", "Odisha", "Andhra Pradesh"],
    recommendedPolicyAction: "Launch National Green Hydrogen Skill Mission in coastal industrial clusters.",
  },
  {
    skillId: "skill-robotics-kinematics",
    skillName: "Robotic Cell Spot Welding & Kinematics",
    category: "HIGH_GROWTH",
    nationalDemandRank: 5,
    demandSupplyRatio: 2.8,
    annualNationalDemand: 29000,
    annualVerifiedSupply: 10400,
    growthRateYoYPercentage: 38.0,
    leadingStates: ["Tamil Nadu", "Maharashtra", "Haryana", "Karnataka"],
    recommendedPolicyAction: "Retrain ITI welding instructors on 6-Axis FANUC and KUKA controller programming.",
  },
];

export const policyPriorityService = {
  async getNationalSkillPriorities(): Promise<SkillPriorityItem[]> {
    return PAN_INDIA_SKILL_PRIORITIES;
  },

  async getStateSkillPriorities(stateCode: string): Promise<SkillPriorityItem[]> {
    const list = [...PAN_INDIA_SKILL_PRIORITIES];
    // Filter/prioritize by state relevance
    return list.filter((item) =>
      item.leadingStates.some((s) => s.toLowerCase().includes(stateCode.toLowerCase()) || stateCode === "MH")
    );
  },

  async getPolicyRecommendations(params?: { stateCode?: string; districtName?: string }): Promise<PolicyRecommendation[]> {
    return policyRecommendationRepository.findAll(params);
  },
};
