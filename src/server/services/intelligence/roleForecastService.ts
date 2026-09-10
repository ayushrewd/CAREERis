// ==============================================================================
// CAREERIS ROLE FORECAST SERVICE
// Occupational Trajectories, Rising & Declining Roles Intelligence
// ==============================================================================

export interface RoleForecastRecord {
  roleId: string;
  roleTitle: string;
  industry: string;
  trajectoryStatus: "RISING" | "STABLE" | "DECLINING" | "EMERGING";
  currentRequisitions: number;
  projected12MRequisitions: number;
  growthPercentage: number;
  criticalSkillsRequired: string[];
  averageEntrySalaryINR: { min: number; max: number };
  careerAdvancementScore: number; // 0 - 100
}

const CANONICAL_ROLE_FORECASTS: RoleForecastRecord[] = [
  {
    roleId: "role-bms-specialist",
    roleTitle: "EV Battery Management System (BMS) Calibration Specialist",
    industry: "Automotive & EV",
    trajectoryStatus: "RISING",
    currentRequisitions: 3800,
    projected12MRequisitions: 8400,
    growthPercentage: 121.0,
    criticalSkillsRequired: ["Battery Management Systems (BMS)", "High-Voltage Safety Norms", "CAN Bus Communication"],
    averageEntrySalaryINR: { min: 750000, max: 1400000 },
    careerAdvancementScore: 94,
  },
  {
    roleId: "role-5axis-machinist",
    roleTitle: "5-Axis CNC Precision Toolmaker & Aerospace Machinist",
    industry: "Precision Manufacturing",
    trajectoryStatus: "RISING",
    currentRequisitions: 6200,
    projected12MRequisitions: 12500,
    growthPercentage: 101.6,
    criticalSkillsRequired: ["5-Axis CNC Precision Machining", "FANUC / Siemens Programming", "Zeiss CMM Inspection"],
    averageEntrySalaryINR: { min: 550000, max: 950000 },
    careerAdvancementScore: 91,
  },
  {
    roleId: "role-manual-welder",
    roleTitle: "Manual Shielded Metal Arc Welder (Legacy Trade)",
    industry: "Legacy Fabrication",
    trajectoryStatus: "DECLINING",
    currentRequisitions: 4200,
    projected12MRequisitions: 1600,
    growthPercentage: -61.9,
    criticalSkillsRequired: ["Manual Shielded Metal Arc Welding"],
    averageEntrySalaryINR: { min: 250000, max: 400000 },
    careerAdvancementScore: 38,
  },
];

export const roleForecastService = {
  async getAllRoleForecasts(): Promise<RoleForecastRecord[]> {
    return JSON.parse(JSON.stringify(CANONICAL_ROLE_FORECASTS));
  },

  async getRoleForecastById(roleId: string): Promise<RoleForecastRecord | null> {
    const found = CANONICAL_ROLE_FORECASTS.find((r) => r.roleId === roleId || r.roleTitle.toLowerCase().includes(roleId.toLowerCase()));
    return found ? JSON.parse(JSON.stringify(found)) : CANONICAL_ROLE_FORECASTS[0];
  },
};
