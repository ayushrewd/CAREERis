// ==============================================================================
// CAREERIS CANONICAL POLICY INTELLIGENCE DATA
// Ground-Truth Datasets for National Command Center, Schemes, District Plans & Policy Scenarios
// ==============================================================================

import {
  SchemeIntelligenceRecord,
  DistrictSkillActionPlanRecord,
  PolicyScenarioModel,
  GovernmentAlertRecord,
  PolicyDecisionRecord,
} from "@/types/policyIntelligence";

export const CANONICAL_NATIONAL_METRICS = {
  totalActiveNationalDemand: 4850000,
  totalVerifiedCandidateSupply: 3240000,
  netNationalSkillGap: 1610000,
  totalAuditedInstitutes: 14953,
  nationalSanctionedSeats: 2450000,
  averageCapacityUtilization: 81.2,
  averageNationalPlacementRate: 78.6,
  topDemandedSkillsPanIndia: [
    { skillName: "Battery Management Systems (BMS)", demandCount: 142000, supplyCount: 38000, gap: 104000, isEmerging: true },
    { skillName: "High-Voltage Safety Protocols", demandCount: 125000, supplyCount: 42000, gap: 83000, isEmerging: true },
    { skillName: "5-Axis CNC Milling", demandCount: 98000, supplyCount: 51000, gap: 47000, isEmerging: false },
    { skillName: "Solar PV String Inverter Installation", demandCount: 86000, supplyCount: 44000, gap: 42000, isEmerging: true },
    { skillName: "Industrial Robotics Maintenance", demandCount: 74000, supplyCount: 32000, gap: 42000, isEmerging: true },
  ],
  lastUpdated: "2026-02-27T00:00:00Z",
};

export const CANONICAL_SCHEMES: SchemeIntelligenceRecord[] = [
  {
    schemeId: "sch-pmkvy-4",
    schemeCode: "PMKVY_4_SPECIAL",
    name: "Pradhan Mantri Kaushal Vikas Yojana 4.0 (Future Skills & EV Special Project)",
    department: "Ministry of Skill Development and Entrepreneurship (MSDE)",
    targetDemographic: "Youth (18-35) with ITI / Polytechnic / Technical Backgrounds",
    targetGeographies: ["Pan-India", "Maharashtra", "Tamil Nadu", "Gujarat", "Karnataka"],
    alignedSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Protocols", "Industrial Robotics Maintenance"],
    allocatedBudgetINR: 1200000000, // ₹120 Cr
    spentBudgetINR: 840000000,     // ₹84 Cr
    totalEnrolledCount: 185000,
    totalCertifiedCount: 162000,
    placementRatePercentage: 84.5,
    policyCoverageStatus: "SUFFICIENT",
    lastAuditedAt: "2026-01-30T10:00:00Z",
  },
  {
    schemeId: "sch-naps-dual",
    schemeCode: "NAPS_DUAL_APPRENTICE",
    name: "National Apprenticeship Promotion Scheme (Dual-System Automotive Track)",
    department: "Directorate General of Training (DGT)",
    targetDemographic: "Apprentices & ITI Graduates",
    targetGeographies: ["Industrial Clusters: Chakan, Oragadam, Sanand, Sriperumbudur"],
    alignedSkills: ["5-Axis CNC Milling", "Advanced CAM Post-Processing", "CAN Bus Diagnostics"],
    allocatedBudgetINR: 800000000,  // ₹80 Cr
    spentBudgetINR: 620000000,     // ₹62 Cr
    totalEnrolledCount: 95000,
    totalCertifiedCount: 88000,
    placementRatePercentage: 89.2,
    policyCoverageStatus: "SUFFICIENT",
    lastAuditedAt: "2026-02-10T10:00:00Z",
  },
  {
    schemeId: "sch-green-hydrogen-gap",
    schemeCode: "GREEN_HYDROGEN_PILOT",
    name: "National Green Hydrogen Mission Skill Development Sub-Scheme",
    department: "Ministry of New and Renewable Energy (MNRE)",
    targetDemographic: "Chemical & Electrical Technicians",
    targetGeographies: ["Gujarat", "Odisha", "Andhra Pradesh"],
    alignedSkills: ["Electrolyzer Maintenance", "Cryogenic H2 Safety"],
    allocatedBudgetINR: 350000000,  // ₹35 Cr
    spentBudgetINR: 80000000,      // ₹8 Cr
    totalEnrolledCount: 4200,
    totalCertifiedCount: 3100,
    placementRatePercentage: 72.0,
    policyCoverageStatus: "POLICY_COVERAGE_GAP",
    gapExplanation: "Severe shortage of certified master trainers and specialized cryogenic simulation labs in Western maritime corridor.",
    lastAuditedAt: "2026-02-15T10:00:00Z",
  },
];

export const CANONICAL_ACTION_PLANS: DistrictSkillActionPlanRecord[] = [
  {
    planId: "dsap-pune-2026",
    district: "Pune",
    state: "Maharashtra",
    priorityScore: 94,
    priorityClassification: "CRITICAL",
    keyDeficitSkills: [
      { skillName: "Battery Management Systems (BMS)", annualDeficitHeadcount: 2400, severity: "CRITICAL" },
      { skillName: "High-Voltage Safety Protocols", annualDeficitHeadcount: 1800, severity: "CRITICAL" },
      { skillName: "CAN Bus Diagnostics", annualDeficitHeadcount: 1200, severity: "HIGH" },
    ],
    baselineTrainingCapacitySeats: 4800,
    targetTrainingCapacitySeats: 7200,
    approvedInterventionsCount: 3,
    allocatedBudgetINR: 185000000, // ₹18.5 Cr
    status: "IN_EXECUTION",
    leadOfficerName: "Shri Rajesh Patil (IAS), District Collector & Skill Committee Chairman",
    lastUpdatedAt: "2026-02-20T14:00:00Z",
  },
  {
    planId: "dsap-chennai-2026",
    district: "Chennai",
    state: "Tamil Nadu",
    priorityScore: 88,
    priorityClassification: "HIGH",
    keyDeficitSkills: [
      { skillName: "5-Axis CNC Milling", annualDeficitHeadcount: 1600, severity: "HIGH" },
      { skillName: "Industrial Robotics Maintenance", annualDeficitHeadcount: 1100, severity: "HIGH" },
    ],
    baselineTrainingCapacitySeats: 5200,
    targetTrainingCapacitySeats: 6800,
    approvedInterventionsCount: 2,
    allocatedBudgetINR: 120000000, // ₹12.0 Cr
    status: "APPROVED",
    leadOfficerName: "Smt. K. Anitha (IAS), District Skill Committee Head",
    lastUpdatedAt: "2026-02-18T10:00:00Z",
  },
];

export const CANONICAL_POLICY_SCENARIOS: PolicyScenarioModel[] = [
  {
    scenarioId: "scen-ev-pune-1000",
    title: "Scenario A: +1,000 High-Voltage EV Training Seats (Chakan Corridor)",
    description: "Upgrade 4 ITIs in Pune district with EV Battery Simulation Rigs and ASDC-certified trainer deployments.",
    scenarioType: "SEAT_EXPANSION",
    scopeGeography: "Pune District, Maharashtra",
    baselineSeats: 4800,
    simulatedSeats: 5800,
    baselineSkillGap: 2400,
    projectedSkillGapReductionPercentage: 41.7,
    estimatedCostINR: 62000000, // ₹6.2 Cr
    timeToImpactWeeks: 12,
    confidenceScore: 94,
    riskAnalysis: "Low risk. ITI Aundh COE has existing facility footprint ready for immediate equipment installation.",
    assumptions: ["Equipment delivery within 6 weeks", "Trainer availability from ASDC master trainer pool"],
  },
  {
    scenarioId: "scen-trainer-retrain-200",
    title: "Scenario B: Retrain 200 Mechanical Instructors into Mechatronics & EV Specialists",
    description: "Mandatory 4-week fast-track residential upskilling at National Skill Training Institute (NSTI) Mumbai & Chennai.",
    scenarioType: "TRAINER_RETRAINING",
    scopeGeography: "Maharashtra & Tamil Nadu",
    baselineSeats: 10000,
    simulatedSeats: 13500,
    baselineSkillGap: 3800,
    projectedSkillGapReductionPercentage: 62.5,
    estimatedCostINR: 28000000, // ₹2.8 Cr
    timeToImpactWeeks: 8,
    confidenceScore: 96,
    riskAnalysis: "Very low risk. Highest ROI intervention with immediate multiplying effect on annual student throughput.",
    assumptions: ["100% instructor release from duty during exam recess"],
  },
];

export const CANONICAL_GOVERNMENT_ALERTS: GovernmentAlertRecord[] = [
  {
    alertId: "alt-bms-pune-01",
    severity: "CRITICAL",
    title: "Acute BMS Telemetry Skill Shortage in Chakan Industrial Corridor",
    description: "Employer hiring demand for EV Battery Specialists exceeded verified graduate supply by 310% over the last 90 days.",
    triggerType: "SKILL_DEFICIT",
    state: "Maharashtra",
    district: "Pune",
    cluster: "Chakan Automotive Hub",
    affectedSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Protocols"],
    evidenceSource: "Tata Motors & Mahindra Plant TA Requisitions + ITI Aundh Capacity Audit",
    timestamp: "2026-02-25T08:30:00Z",
    status: "ACTIVE",
  },
  {
    alertId: "alt-cnc-chennai-02",
    severity: "HIGH",
    title: "5-Axis CNC Milling Equipment Obsolescence in 3 Chennai ITIs",
    description: "Dual-spindle CNC machines non-operational in North Chennai cluster, causing 180 trainees to defer practical certification.",
    triggerType: "EQUIPMENT_DEFICIT",
    state: "Tamil Nadu",
    district: "Chennai",
    cluster: "Ambattur Industrial Estate",
    affectedSkills: ["5-Axis CNC Milling"],
    evidenceSource: "DGT Annual Lab Readiness Inspection Report 2026",
    timestamp: "2026-02-22T11:15:00Z",
    status: "ACKNOWLEDGED",
  },
];

export const CANONICAL_POLICY_DECISIONS: PolicyDecisionRecord[] = [
  {
    decisionId: "dec-pune-ev-approval-01",
    actionPlanId: "dsap-pune-2026",
    interventionId: "int-ev-aundh-expand-01",
    decisionTitle: "Formal Approval: ₹18.5 Cr Pune EV Centre of Excellence Capacity Expansion",
    decisionMakerName: "Dr. Sanjay Chahande (IAS)",
    decisionMakerRole: "GOVERNMENT_ADMIN",
    approvedAt: "2026-02-22T15:30:00Z",
    rationale: "Approved under PMKVY 4.0 Special Project Fund to eliminate critical 2,400 EV technician shortage by Q3 2026.",
    allocatedBudgetINR: 185000000,
    targetSkillGapReductionPercentage: 75.0,
    auditSignature: "SHA256:e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
  },
];
