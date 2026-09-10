// ==============================================================================
// CAREERIS CANONICAL TRAINING PLANS DATA
// District, State & National Capacity Plans & Training Ecosystem Prioritization
// ==============================================================================

export interface TrainingPlanDossier {
  scope: "DISTRICT" | "STATE" | "NATIONAL";
  id: string;
  name: string;
  stateCode?: string;
  districtId?: string;
  prioritySkills: Array<{ skillId: string; skillName: string; requiredSeats: number; currentSeats: number; gap: number }>;
  recommendedCourseModernizations: string[];
  trainerShortageCount: number;
  equipmentUpgradeBudgetINR: number;
  totalRecommendedInvestmentINR: number;
  expectedAnnualPlacedGraduates: number;
  planPeriod: string;
}

export const CANONICAL_TRAINING_PLANS: TrainingPlanDossier[] = [
  {
    scope: "DISTRICT",
    id: "plan-dist-pune-2026",
    name: "Pune District Comprehensive Vocational Training Plan (FY 2026-27)",
    stateCode: "MH",
    districtId: "dist-pune",
    prioritySkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", requiredSeats: 1200, currentSeats: 480, gap: 720 },
      { skillId: "skill-5axis-cnc", skillName: "5-Axis CNC Precision Machining", requiredSeats: 3200, currentSeats: 2100, gap: 1100 },
      { skillId: "skill-plc-auto", skillName: "PLC Automation & SCADA", requiredSeats: 2600, currentSeats: 1900, gap: 700 },
    ],
    recommendedCourseModernizations: [
      "Modernize 4 manual welding batches to Robotic Cell Spot Welding at ITI Aundh & ITI Pimpri.",
      "Install High-Voltage Battery Traction Benches for EV Powertrain Specialist cohorts.",
    ],
    trainerShortageCount: 38,
    equipmentUpgradeBudgetINR: 45000000,
    totalRecommendedInvestmentINR: 62000000,
    expectedAnnualPlacedGraduates: 4200,
    planPeriod: "2026-2027",
  },
  {
    scope: "STATE",
    id: "plan-state-mh-2026",
    name: "Maharashtra State Vocational Training & Capacity Roadmap (FY 2026-27)",
    stateCode: "MH",
    prioritySkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", requiredSeats: 4500, currentSeats: 1650, gap: 2850 },
      { skillId: "skill-5axis-cnc", skillName: "5-Axis CNC Precision Machining", requiredSeats: 9500, currentSeats: 5800, gap: 3700 },
      { skillId: "skill-solar-pv", skillName: "Solar PV Grid Integration", requiredSeats: 4200, currentSeats: 2100, gap: 2100 },
    ],
    recommendedCourseModernizations: [
      "Standardize Industry 4.0 Mechatronics syllabus across 36 District ITIs.",
      "Launch Dual-Vocational NAPS Apprenticeship Corridors across Pune, Aurangabad, and Thane.",
    ],
    trainerShortageCount: 142,
    equipmentUpgradeBudgetINR: 180000000,
    totalRecommendedInvestmentINR: 285000000,
    expectedAnnualPlacedGraduates: 18500,
    planPeriod: "2026-2027",
  },
  {
    scope: "NATIONAL",
    id: "plan-national-india-2026",
    name: "National Technical & Vocational Training Strategic Roadmap (Vision 2027)",
    prioritySkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", requiredSeats: 38000, currentSeats: 12400, gap: 25600 },
      { skillId: "skill-5axis-cnc", skillName: "5-Axis CNC Precision Machining", requiredSeats: 65000, currentSeats: 32000, gap: 33000 },
      { skillId: "skill-ai-edge", skillName: "Edge AI & Embedded Firmware", requiredSeats: 42000, currentSeats: 14500, gap: 27500 },
      { skillId: "skill-green-h2", skillName: "Green Hydrogen Electrolyzer Tech", requiredSeats: 12000, currentSeats: 2500, gap: 9500 },
    ],
    recommendedCourseModernizations: [
      "Nationwide phase-out of unaligned manual trades in high-automation industrial clusters.",
      "Expand STRIVE World Bank ITI modernization to 250 additional industrial ITIs.",
      "Institute National Skill Passport verified apprenticeship incentives under NAPS.",
    ],
    trainerShortageCount: 1250,
    equipmentUpgradeBudgetINR: 1200000000,
    totalRecommendedInvestmentINR: 2200000000,
    expectedAnnualPlacedGraduates: 145000,
    planPeriod: "2026-2027",
  },
];
