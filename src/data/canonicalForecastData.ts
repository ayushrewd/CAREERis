// ==============================================================================
// CAREERIS CANONICAL PREDICTIVE FORECAST DATA
// 3M - 36M Multi-Horizon Projections, Adoption Curves & Skill Obsolescence
// ==============================================================================

import {
  LabourDemandForecast,
  SkillDemandForecast,
  FutureSkillBundle,
} from "@/types/predictiveIntelligence";

export const CANONICAL_LABOUR_DEMAND_FORECASTS: LabourDemandForecast[] = [
  {
    id: "fc-national-overall-2026",
    scope: "NATIONAL",
    scopeEntityId: "india-national",
    scopeEntityName: "India (All-Sector Aggregate)",
    currentDemand: 2450000,
    forecastDemand: 3180000,
    absoluteChange: 730000,
    percentageChange: 29.8,
    trend: "RISING",
    forecastHorizon: "12M",
    confidenceScore: 0.94,
    historicalData: [
      { date: "2025-01", demand: 2100000 },
      { date: "2025-04", demand: 2180000 },
      { date: "2025-07", demand: 2260000 },
      { date: "2025-10", demand: 2350000 },
      { date: "2026-01", demand: 2450000 },
    ],
    projections: [
      { date: "2026-04", projectedDemand: 2610000, lowerConfidenceBound: 2540000, upperConfidenceBound: 2680000, confidenceScore: 0.96 },
      { date: "2026-07", projectedDemand: 2790000, lowerConfidenceBound: 2700000, upperConfidenceBound: 2880000, confidenceScore: 0.94 },
      { date: "2026-10", projectedDemand: 2980000, lowerConfidenceBound: 2860000, upperConfidenceBound: 3100000, confidenceScore: 0.91 },
      { date: "2027-01", projectedDemand: 3180000, lowerConfidenceBound: 3020000, upperConfidenceBound: 3340000, confidenceScore: 0.88 },
    ],
    majorDriverSignals: [
      "Semiconductor & Electronics PLI Phase-2 factory commissioning (+42% YoY hiring).",
      "EV Gigafactory expansion across TN, MH, and Gujarat corridors (+38% YoY).",
      "Green Hydrogen and Solar PV grid automation acceleration (+28% YoY).",
    ],
    limitations: [
      "Global macroeconomic export volatility could alter OEM equipment ramp-up schedules.",
    ],
    lastUpdated: "2026-02-20T10:00:00Z",
    isDemoData: true,
  },
  {
    id: "fc-state-mh-auto-2026",
    scope: "STATE",
    scopeEntityId: "MH",
    scopeEntityName: "Maharashtra (Automotive & EV Hub)",
    currentDemand: 485000,
    forecastDemand: 642000,
    absoluteChange: 157000,
    percentageChange: 32.4,
    trend: "RISING",
    forecastHorizon: "12M",
    confidenceScore: 0.95,
    historicalData: [
      { date: "2025-01", demand: 410000 },
      { date: "2025-04", demand: 428000 },
      { date: "2025-07", demand: 445000 },
      { date: "2025-10", demand: 465000 },
      { date: "2026-01", demand: 485000 },
    ],
    projections: [
      { date: "2026-04", projectedDemand: 520000, lowerConfidenceBound: 508000, upperConfidenceBound: 532000, confidenceScore: 0.96 },
      { date: "2026-07", projectedDemand: 558000, lowerConfidenceBound: 540000, upperConfidenceBound: 576000, confidenceScore: 0.94 },
      { date: "2026-10", projectedDemand: 598000, lowerConfidenceBound: 575000, upperConfidenceBound: 621000, confidenceScore: 0.91 },
      { date: "2027-01", projectedDemand: 642000, lowerConfidenceBound: 610000, upperConfidenceBound: 674000, confidenceScore: 0.88 },
    ],
    majorDriverSignals: [
      "Tata Motors & Mahindra EV battery pack assembly expansions in Chakan.",
      "Tier-1 robotic spot welding automation retrofits.",
    ],
    limitations: [
      "High-voltage safety certification throughput in regional ITIs.",
    ],
    lastUpdated: "2026-02-20T10:00:00Z",
    isDemoData: true,
  },
  {
    id: "fc-dist-pune-2026",
    scope: "DISTRICT",
    scopeEntityId: "dist-pune",
    scopeEntityName: "Pune District (Chakan-Talegaon Corridor)",
    currentDemand: 168000,
    forecastDemand: 228000,
    absoluteChange: 60000,
    percentageChange: 35.7,
    trend: "RISING",
    forecastHorizon: "12M",
    confidenceScore: 0.96,
    historicalData: [
      { date: "2025-01", demand: 138000 },
      { date: "2025-04", demand: 145000 },
      { date: "2025-07", demand: 152000 },
      { date: "2025-10", demand: 160000 },
      { date: "2026-01", demand: 168000 },
    ],
    projections: [
      { date: "2026-04", projectedDemand: 181000, lowerConfidenceBound: 176000, upperConfidenceBound: 186000, confidenceScore: 0.97 },
      { date: "2026-07", projectedDemand: 196000, lowerConfidenceBound: 189000, upperConfidenceBound: 203000, confidenceScore: 0.95 },
      { date: "2026-10", projectedDemand: 211000, lowerConfidenceBound: 202000, upperConfidenceBound: 220000, confidenceScore: 0.92 },
      { date: "2027-01", projectedDemand: 228000, lowerConfidenceBound: 216000, upperConfidenceBound: 240000, confidenceScore: 0.89 },
    ],
    majorDriverSignals: [
      "Chakan Auto Cluster expansion with 14,000 new BMS technician requisitions.",
      "5-Axis CNC aerospace tooling orders from Hinjawadi tech corridor.",
    ],
    limitations: [
      "Relocation friction for rural candidates from Marathwada into Pune.",
    ],
    lastUpdated: "2026-02-20T10:00:00Z",
    isDemoData: true,
  },
];

export const CANONICAL_SKILL_FORECASTS: Record<string, SkillDemandForecast> = {
  "skill-bms": {
    skillId: "skill-bms",
    skillName: "Battery Management Systems (BMS)",
    categoryName: "Automotive & CleanTech",
    currentAnnualDemand: 14200,
    projectedAnnualDemand: 38400,
    growthRatePercentage: 170.4,
    adoptionStage: "ACCELERATION",
    employerAdoptionVelocity: 94,
    crossIndustryDiffusionIndex: 88,
    trainingSupplyLagMonths: 8,
    projections: [
      { date: "2026-04", projectedDemand: 18500, lowerConfidenceBound: 17800, upperConfidenceBound: 19200, confidenceScore: 0.97 },
      { date: "2026-07", projectedDemand: 24200, lowerConfidenceBound: 23100, upperConfidenceBound: 25300, confidenceScore: 0.95 },
      { date: "2026-10", projectedDemand: 31000, lowerConfidenceBound: 29200, upperConfidenceBound: 32800, confidenceScore: 0.92 },
      { date: "2027-01", projectedDemand: 38400, lowerConfidenceBound: 35800, upperConfidenceBound: 41000, confidenceScore: 0.89 },
    ],
    obsolescenceRisk: {
      level: "LOW_RISK",
      signals: ["High-voltage architecture migration (400V to 800V) increasing ECU complexity."],
      potentialSubstitutes: [],
    },
    adjacentSkills: [
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms", relationship: "PREREQUISITE" },
      { skillId: "skill-can-bus", skillName: "CAN Bus Communication", relationship: "COMPLEMENTARY" },
      { skillId: "skill-ai-edge", skillName: "Edge AI & Embedded Firmware", relationship: "ADJACENT" },
    ],
    forecastConfidence: 0.95,
  },
  "skill-5axis-cnc": {
    skillId: "skill-5axis-cnc",
    skillName: "5-Axis CNC Precision Machining",
    categoryName: "Precision Manufacturing",
    currentAnnualDemand: 28500,
    projectedAnnualDemand: 62000,
    growthRatePercentage: 117.5,
    adoptionStage: "ACCELERATION",
    employerAdoptionVelocity: 91,
    crossIndustryDiffusionIndex: 82,
    trainingSupplyLagMonths: 6,
    projections: [
      { date: "2026-04", projectedDemand: 35000, lowerConfidenceBound: 34000, upperConfidenceBound: 36000, confidenceScore: 0.96 },
      { date: "2026-07", projectedDemand: 43000, lowerConfidenceBound: 41500, upperConfidenceBound: 44500, confidenceScore: 0.94 },
      { date: "2026-10", projectedDemand: 52000, lowerConfidenceBound: 49800, upperConfidenceBound: 54200, confidenceScore: 0.91 },
      { date: "2027-01", projectedDemand: 62000, lowerConfidenceBound: 58500, upperConfidenceBound: 65500, confidenceScore: 0.88 },
    ],
    obsolescenceRisk: {
      level: "LOW_RISK",
      signals: ["Replacing 3-axis manual setups in aerospace and EV lightweighting."],
      potentialSubstitutes: [],
    },
    adjacentSkills: [
      { skillId: "skill-fanuc-prog", skillName: "FANUC / Siemens Controller Programming", relationship: "COMPLEMENTARY" },
      { skillId: "skill-cmm-inspection", skillName: "Zeiss CMM Inspection", relationship: "COMPLEMENTARY" },
    ],
    forecastConfidence: 0.94,
  },
  "skill-manual-arc-weld": {
    skillId: "skill-manual-arc-weld",
    skillName: "Manual Shielded Metal Arc Welding",
    categoryName: "Legacy Fabrication",
    currentAnnualDemand: 18200,
    projectedAnnualDemand: 6800,
    growthRatePercentage: -62.6,
    adoptionStage: "DECLINING",
    employerAdoptionVelocity: 22,
    crossIndustryDiffusionIndex: 30,
    trainingSupplyLagMonths: 0,
    projections: [
      { date: "2026-04", projectedDemand: 14500, lowerConfidenceBound: 13800, upperConfidenceBound: 15200, confidenceScore: 0.96 },
      { date: "2026-07", projectedDemand: 11200, lowerConfidenceBound: 10400, upperConfidenceBound: 12000, confidenceScore: 0.93 },
      { date: "2026-10", projectedDemand: 8800, lowerConfidenceBound: 8000, upperConfidenceBound: 9600, confidenceScore: 0.90 },
      { date: "2027-01", projectedDemand: 6800, lowerConfidenceBound: 5900, upperConfidenceBound: 7700, confidenceScore: 0.86 },
    ],
    obsolescenceRisk: {
      level: "CRITICAL",
      signals: [
        "Automotive OEM body shops are 92% automated robotic spot welding.",
        "Requisition listings declined -48% YoY across Pune and Chennai corridors.",
      ],
      potentialSubstitutes: [
        { skillId: "skill-robotics-kinematics", skillName: "Robotic Cell Kinematics & Spot Welding", similarityScore: 0.88 },
        { skillId: "skill-laser-weld", skillName: "Automated Fiber Laser Welding", similarityScore: 0.82 },
      ],
    },
    adjacentSkills: [
      { skillId: "skill-gas-cutting", skillName: "Oxy-Fuel Gas Cutting", relationship: "COMPLEMENTARY" },
    ],
    forecastConfidence: 0.96,
  },
};

export const CANONICAL_FUTURE_SKILL_BUNDLES: FutureSkillBundle[] = [
  {
    bundleId: "bundle-ev-powertrain-lead",
    bundleName: "EV Powertrain & High-Voltage Diagnostics Master Bundle",
    skills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)" },
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms" },
      { skillId: "skill-can-bus", skillName: "CAN Bus Communication" },
      { skillId: "skill-uds-diag", skillName: "UDS Diagnostic Protocol (ISO 14229)" },
    ],
    targetRoles: ["EV Powertrain Calibration Specialist", "Battery Pack Systems Engineer"],
    demandingIndustries: ["Automotive & EV", "Renewable Energy Storage"],
    coOccurrenceScore: 96,
    projectedGrowthYoY: 148.5,
    trainingCourseIds: ["course-bms-lead-01"],
  },
  {
    bundleId: "bundle-industry40-machinist",
    bundleName: "Industry 4.0 Multi-Axis CNC & Metrology Bundle",
    skills: [
      { skillId: "skill-5axis-cnc", skillName: "5-Axis CNC Precision Machining" },
      { skillId: "skill-fanuc-prog", skillName: "FANUC / Siemens Controller Programming" },
      { skillId: "skill-cmm-inspection", skillName: "Zeiss CMM Inspection" },
    ],
    targetRoles: ["5-Axis CNC Toolmaker", "Aerospace Precision Machinist"],
    demandingIndustries: ["Aerospace & Defence", "High-Precision Tooling"],
    coOccurrenceScore: 92,
    projectedGrowthYoY: 98.2,
    trainingCourseIds: ["course-5axis-cnc-01"],
  },
];
