// ==============================================================================
// CAREERIS STATE INTELLIGENCE SERVICE
// Pan-India 28 States & 8 UTs Aggregate Intelligence & Geographic Drill-down
// ==============================================================================

import { governmentInterventionRepository } from "@/server/repositories/governmentInterventionRepository";
import { budgetRepository } from "@/server/repositories/budgetRepository";
import { districtRiskRepository } from "@/server/repositories/districtRiskRepository";

export interface StateIntelligenceSummary {
  stateCode: string;
  stateName: string;
  capitalCity: string;
  totalDistrictsCount: number;
  totalIndustrialClustersCount: number;
  annualEmployerDemand: number;
  annualVerifiedSupply: number;
  netSkillGap: number;
  trainingCapacitySeats: number;
  averagePlacementRatePercentage: number;
  topDemandedSkills: string[];
  topShortageSkills: string[];
  topKeyRoles: string[];
  activeInterventionsCount: number;
  budgetAllocatedINR: number;
  budgetSpentINR: number;
  priorityCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isDemoData: boolean;
}

const PAN_INDIA_STATES: StateIntelligenceSummary[] = [
  {
    stateCode: "MH",
    stateName: "Maharashtra",
    capitalCity: "Mumbai",
    totalDistrictsCount: 36,
    totalIndustrialClustersCount: 12,
    annualEmployerDemand: 420000,
    annualVerifiedSupply: 210000,
    netSkillGap: 210000,
    trainingCapacitySeats: 285000,
    averagePlacementRatePercentage: 68.4,
    topDemandedSkills: ["Battery Management Systems (BMS)", "5-Axis CNC Machining", "PLC & SCADA", "CAN Bus Protocol"],
    topShortageSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety", "CAM Multi-Axis Tooling"],
    topKeyRoles: ["EV Powertrain Calibration Specialist", "5-Axis CNC Precision Machinist", "Mechatronics Engineer"],
    activeInterventionsCount: 6,
    budgetAllocatedINR: 1200000000,
    budgetSpentINR: 890000000,
    priorityCategory: "CRITICAL",
    isDemoData: true,
  },
  {
    stateCode: "KA",
    stateName: "Karnataka",
    capitalCity: "Bengaluru",
    totalDistrictsCount: 31,
    totalIndustrialClustersCount: 9,
    annualEmployerDemand: 380000,
    annualVerifiedSupply: 225000,
    netSkillGap: 155000,
    trainingCapacitySeats: 240000,
    averagePlacementRatePercentage: 72.1,
    topDemandedSkills: ["Edge AI & Embedded Firmware", "Cloud Microservices", "Industrial IoT", "CAN Bus"],
    topShortageSkills: ["Edge AI & Embedded Firmware", "Automotive RTOS", "Vector CANoe Diagnostics"],
    topKeyRoles: ["Connected Vehicle Software Engineer", "Industrial IoT Architect", "Robotics Integrator"],
    activeInterventionsCount: 8,
    budgetAllocatedINR: 2100000000,
    budgetSpentINR: 1620000000,
    priorityCategory: "HIGH",
    isDemoData: true,
  },
  {
    stateCode: "TN",
    stateName: "Tamil Nadu",
    capitalCity: "Chennai",
    totalDistrictsCount: 38,
    totalIndustrialClustersCount: 11,
    annualEmployerDemand: 360000,
    annualVerifiedSupply: 240000,
    netSkillGap: 120000,
    trainingCapacitySeats: 290000,
    averagePlacementRatePercentage: 70.8,
    topDemandedSkills: ["Robotic Cell Spot Welding", "Automotive Electronics", "CNC Milling", "PLC Automation"],
    topShortageSkills: ["Robotic Cell Kinematics", "6-Axis Robot Programming", "EV Battery Pack Assembly"],
    topKeyRoles: ["Robotic Cell Lead", "Automotive Quality Assurance Specialist", "Tool & Die Designer"],
    activeInterventionsCount: 7,
    budgetAllocatedINR: 1800000000,
    budgetSpentINR: 1250000000,
    priorityCategory: "HIGH",
    isDemoData: true,
  },
  {
    stateCode: "GJ",
    stateName: "Gujarat",
    capitalCity: "Gandhinagar",
    totalDistrictsCount: 33,
    totalIndustrialClustersCount: 14,
    annualEmployerDemand: 310000,
    annualVerifiedSupply: 195000,
    netSkillGap: 115000,
    trainingCapacitySeats: 230000,
    averagePlacementRatePercentage: 66.5,
    topDemandedSkills: ["5-Axis CNC Precision Machining", "Petrochemical Process Automation", "Solar PV Installation"],
    topShortageSkills: ["5-Axis CNC Programming", "Hazardous Chemical Safety", "Green Hydrogen Electrolyzer Tech"],
    topKeyRoles: ["5-Axis CNC Machinist", "Process Plant Operator", "Renewable Energy Technician"],
    activeInterventionsCount: 5,
    budgetAllocatedINR: 1100000000,
    budgetSpentINR: 760000000,
    priorityCategory: "HIGH",
    isDemoData: true,
  },
  {
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    capitalCity: "Lucknow",
    totalDistrictsCount: 75,
    totalIndustrialClustersCount: 16,
    annualEmployerDemand: 340000,
    annualVerifiedSupply: 180000,
    netSkillGap: 160000,
    trainingCapacitySeats: 320000,
    averagePlacementRatePercentage: 54.2,
    topDemandedSkills: ["Surface Mount Technology (SMT)", "Electronics Assembly", "Solar Rooftop O&M", "Logistics Fleet Dispatch"],
    topShortageSkills: ["SMT Optical Inspection", "IPC-A-610 Soldering Standards", "Cold Chain Logistics Tech"],
    topKeyRoles: ["SMT Assembly Operator", "Solar Technician", "Warehouse Operations Lead"],
    activeInterventionsCount: 9,
    budgetAllocatedINR: 2400000000,
    budgetSpentINR: 1680000000,
    priorityCategory: "HIGH",
    isDemoData: true,
  },
  {
    stateCode: "DL",
    stateName: "Delhi NCR",
    capitalCity: "New Delhi",
    totalDistrictsCount: 11,
    totalIndustrialClustersCount: 8,
    annualEmployerDemand: 280000,
    annualVerifiedSupply: 190000,
    netSkillGap: 90000,
    trainingCapacitySeats: 160000,
    averagePlacementRatePercentage: 74.5,
    topDemandedSkills: ["Full-Stack Software Engineering", "E-Commerce Supply Chain", "EV Charging Infrastructure"],
    topShortageSkills: ["EV Fast-Charging Protocol Compliance", "Cybersecurity Threat Analysis"],
    topKeyRoles: ["EV Charging Fleet Engineer", "Software Systems Architect"],
    activeInterventionsCount: 4,
    budgetAllocatedINR: 950000000,
    budgetSpentINR: 710000000,
    priorityCategory: "MEDIUM",
    isDemoData: true,
  },
  {
    stateCode: "TG",
    stateName: "Telangana",
    capitalCity: "Hyderabad",
    totalDistrictsCount: 33,
    totalIndustrialClustersCount: 7,
    annualEmployerDemand: 260000,
    annualVerifiedSupply: 175000,
    netSkillGap: 85000,
    trainingCapacitySeats: 180000,
    averagePlacementRatePercentage: 71.0,
    topDemandedSkills: ["Biopharma Formulation & GMP", "Data Analytics & ML", "Aerospace Precision Tooling"],
    topShortageSkills: ["Bioprocess Fermentation", "Aerospace Titanium Machining"],
    topKeyRoles: ["Biopharma Quality Control Lead", "Aerospace CNC Specialist"],
    activeInterventionsCount: 5,
    budgetAllocatedINR: 1300000000,
    budgetSpentINR: 940000000,
    priorityCategory: "MEDIUM",
    isDemoData: true,
  },
  {
    stateCode: "RJ",
    stateName: "Rajasthan",
    capitalCity: "Jaipur",
    totalDistrictsCount: 50,
    totalIndustrialClustersCount: 8,
    annualEmployerDemand: 190000,
    annualVerifiedSupply: 115000,
    netSkillGap: 75000,
    trainingCapacitySeats: 170000,
    averagePlacementRatePercentage: 58.6,
    topDemandedSkills: ["Solar Utility Scale O&M", "Wind Turbine Generator Maintenance", "Ceramic & Tile Precision Cutting"],
    topShortageSkills: ["Wind Turbine Inverter Troubleshooting", "High-Voltage Substation Safety"],
    topKeyRoles: ["Solar Plant Electrical Technician", "Wind Farm Maintenance Engineer"],
    activeInterventionsCount: 4,
    budgetAllocatedINR: 880000000,
    budgetSpentINR: 590000000,
    priorityCategory: "MEDIUM",
    isDemoData: true,
  },
];

export const stateIntelligenceService = {
  async getAllStates(): Promise<StateIntelligenceSummary[]> {
    return PAN_INDIA_STATES;
  },

  async getStateByCode(stateCode: string): Promise<StateIntelligenceSummary | null> {
    const found = PAN_INDIA_STATES.find(
      (s) => s.stateCode.toLowerCase() === stateCode.toLowerCase()
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getStateFullDossier(stateCode: string) {
    const state = await this.getStateByCode(stateCode);
    if (!state) return null;

    const interventions = await governmentInterventionRepository.findAll({ stateCode });
    const budgets = await budgetRepository.findAllAllocations({ stateCode });
    const risks = await districtRiskRepository.findAllRisks({ stateCode });
    const priorities = await districtRiskRepository.findAllPriorities({ stateCode });

    return {
      state,
      interventions,
      budgets,
      risks,
      priorities,
    };
  },
};
