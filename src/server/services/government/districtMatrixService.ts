// ==============================================================================
// CAREERIS DISTRICT MATRIX SERVICE
// District Skill Gap Matrix (Rows: Districts, Cols: Skills) & Priority Engine
// ==============================================================================

import {
  DistrictSkillGapMatrixRow,
  DistrictSkillMatrixCell,
  DistrictPriorityCalculation,
  DistrictGapClassification,
} from "@/types/governmentIntelligence";
import { districtRiskRepository } from "@/server/repositories/districtRiskRepository";

const CANONICAL_MATRIX_ROWS: DistrictSkillGapMatrixRow[] = [
  {
    districtId: "dist-pune",
    districtName: "Pune",
    stateCode: "MH",
    stateName: "Maharashtra",
    industrialCluster: "Chakan-Talegaon Industrial Corridor",
    priorityScore: 89,
    priorityCategory: "CRITICAL",
    topShortageSkill: "Battery Management Systems (BMS)",
    activeInterventionsCount: 3,
    skills: {
      "skill-bms": {
        skillId: "skill-bms",
        skillName: "Battery Management Systems (BMS)",
        roleId: "role-bms-lead",
        roleTitle: "BMS Calibration Specialist",
        annualEmployerDemand: 4500,
        annualVerifiedSupply: 980,
        netGap: 3520,
        gapClassification: "CRITICAL_GAP",
        demandSupplyRatio: 4.6,
        hiringDifficulty: "VERY_HIGH",
        trainingCapacitySeats: 480,
      },
      "skill-5axis-cnc": {
        skillId: "skill-5axis-cnc",
        skillName: "5-Axis CNC Precision Machining",
        roleId: "role-cnc-spec",
        roleTitle: "5-Axis CNC Machinist",
        annualEmployerDemand: 8200,
        annualVerifiedSupply: 3400,
        netGap: 4800,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 2.4,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 2100,
      },
      "skill-plc-auto": {
        skillId: "skill-plc-auto",
        skillName: "PLC Automation & SCADA",
        roleId: "role-auto-specialist",
        roleTitle: "Industrial Automation Engineer",
        annualEmployerDemand: 6100,
        annualVerifiedSupply: 2800,
        netGap: 3300,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 2.2,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 1900,
      },
    },
  },
  {
    districtId: "dist-bengaluru-urban",
    districtName: "Bengaluru Urban",
    stateCode: "KA",
    stateName: "Karnataka",
    industrialCluster: "Peenya & Whitefield Tech Zone",
    priorityScore: 82,
    priorityCategory: "HIGH",
    topShortageSkill: "Edge AI & Embedded Firmware",
    activeInterventionsCount: 4,
    skills: {
      "skill-ai-edge": {
        skillId: "skill-ai-edge",
        skillName: "Edge AI & Embedded Firmware",
        roleId: "role-edge-ai-spec",
        roleTitle: "Industrial IoT & Edge AI Engineer",
        annualEmployerDemand: 5800,
        annualVerifiedSupply: 1800,
        netGap: 4000,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 3.2,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 1200,
      },
      "skill-bms": {
        skillId: "skill-bms",
        skillName: "Battery Management Systems (BMS)",
        roleId: "role-bms-lead",
        roleTitle: "BMS Calibration Specialist",
        annualEmployerDemand: 2400,
        annualVerifiedSupply: 1100,
        netGap: 1300,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 2.2,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 600,
      },
      "skill-plc-auto": {
        skillId: "skill-plc-auto",
        skillName: "PLC Automation & SCADA",
        roleId: "role-auto-specialist",
        roleTitle: "Industrial Automation Engineer",
        annualEmployerDemand: 4200,
        annualVerifiedSupply: 3900,
        netGap: 300,
        gapClassification: "BALANCED",
        demandSupplyRatio: 1.1,
        hiringDifficulty: "LOW",
        trainingCapacitySeats: 2400,
      },
    },
  },
  {
    districtId: "dist-chennai",
    districtName: "Chennai",
    stateCode: "TN",
    stateName: "Tamil Nadu",
    industrialCluster: "Oragadam-Sriperumbudur Auto Hub",
    priorityScore: 78,
    priorityCategory: "HIGH",
    topShortageSkill: "Robotic Cell Spot Welding",
    activeInterventionsCount: 3,
    skills: {
      "skill-robotics-kinematics": {
        skillId: "skill-robotics-kinematics",
        skillName: "Robotic Cell Spot Welding",
        roleId: "role-robotics-lead",
        roleTitle: "Robotic Cell Lead",
        annualEmployerDemand: 3800,
        annualVerifiedSupply: 1200,
        netGap: 2600,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 3.2,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 800,
      },
      "skill-5axis-cnc": {
        skillId: "skill-5axis-cnc",
        skillName: "5-Axis CNC Precision Machining",
        roleId: "role-cnc-spec",
        roleTitle: "5-Axis CNC Machinist",
        annualEmployerDemand: 4800,
        annualVerifiedSupply: 3200,
        netGap: 1600,
        gapClassification: "MODERATE_GAP",
        demandSupplyRatio: 1.5,
        hiringDifficulty: "MODERATE",
        trainingCapacitySeats: 2200,
      },
    },
  },
  {
    districtId: "dist-ahmedabad",
    districtName: "Ahmedabad",
    stateCode: "GJ",
    stateName: "Gujarat",
    industrialCluster: "Sanand Auto Corridor",
    priorityScore: 71,
    priorityCategory: "HIGH",
    topShortageSkill: "5-Axis CNC Precision Machining",
    activeInterventionsCount: 2,
    skills: {
      "skill-5axis-cnc": {
        skillId: "skill-5axis-cnc",
        skillName: "5-Axis CNC Precision Machining",
        roleId: "role-cnc-spec",
        roleTitle: "5-Axis CNC Machinist",
        annualEmployerDemand: 2600,
        annualVerifiedSupply: 1100,
        netGap: 1500,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 2.4,
        hiringDifficulty: "HIGH",
        trainingCapacitySeats: 900,
      },
    },
  },
  {
    districtId: "dist-gautam-buddha-nagar",
    districtName: "Gautam Buddha Nagar",
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    industrialCluster: "Noida Sector 62 Electronics Hub",
    priorityScore: 68,
    priorityCategory: "MEDIUM",
    topShortageSkill: "Surface Mount Technology (SMT)",
    activeInterventionsCount: 2,
    skills: {
      "skill-smt-assembly": {
        skillId: "skill-smt-assembly",
        skillName: "Surface Mount Technology (SMT)",
        roleId: "role-smt-tech",
        roleTitle: "SMT Assembly Specialist",
        annualEmployerDemand: 3200,
        annualVerifiedSupply: 1500,
        netGap: 1700,
        gapClassification: "HIGH_GAP",
        demandSupplyRatio: 2.1,
        hiringDifficulty: "MODERATE",
        trainingCapacitySeats: 1100,
      },
    },
  },
];

export const districtMatrixService = {
  async getDistrictSkillMatrix(params?: {
    stateCode?: string;
    skillId?: string;
    priorityCategory?: string;
  }): Promise<DistrictSkillGapMatrixRow[]> {
    let list = [...CANONICAL_MATRIX_ROWS];

    if (params?.stateCode) {
      list = list.filter((r) => r.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.priorityCategory) {
      list = list.filter((r) => r.priorityCategory === params.priorityCategory);
    }
    if (params?.skillId) {
      list = list.filter((r) => !!r.skills[params.skillId!]);
    }

    return list;
  },

  async getDistrictPriorityRanking(params?: { stateCode?: string }): Promise<DistrictPriorityCalculation[]> {
    return districtRiskRepository.findAllPriorities(params);
  },

  async getDistrictPriorityDetails(districtId: string): Promise<DistrictPriorityCalculation | null> {
    return districtRiskRepository.findPriorityByDistrictId(districtId);
  },
};
