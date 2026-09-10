// ==============================================================================
// CAREERIS CANONICAL EMPLOYER OPERATIONS DATA
// Ground-Truth Datasets for Employer Talent Intelligence & Hiring Operating System
// ==============================================================================

import {
  EmployerTalentPool,
  WorkforceForecastHorizon,
  WorkforceScenarioSimulation,
  EmployerReskillingPathway,
  TrainingPartnerDetail,
  EmployerSkillDemandSurvey,
  EmployerPlacementFeedbackRecord,
  EmployerIndustryBenchmark,
} from "@/types/employerOperations";

export const CANONICAL_TALENT_POOLS: EmployerTalentPool[] = [
  {
    poolId: "pool-ev-pune-01",
    employerId: "emp-tata-motors",
    name: "High-Voltage EV Battery Technicians (Pune Cluster)",
    description: "Verified NCVT and ASDC Level-5 candidates with hands-on battery pack teardown and CAN telemetry diagnostics experience.",
    tags: ["EV", "BMS", "High-Voltage", "Chakan", "NCVT-Certified"],
    candidateCount: 48,
    filterCriteria: {
      skills: ["Battery Management Systems (BMS)", "High-Voltage Safety Protocols", "CAN Bus Diagnostics"],
      minReadinessScore: 75,
      locations: ["Pune", "Pimpri-Chinchwad", "Chakan"],
      hasVerifiedPassport: true,
    },
    candidateIds: ["cand-rohit-01", "cand-vikram-02", "cand-anita-03"],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-20T15:30:00Z",
  },
  {
    poolId: "pool-cnc-pune-02",
    employerId: "emp-tata-motors",
    name: "Precision CNC & Robotic Maintenance Specialists",
    description: "5-Axis CNC operators and Fanuc/KUKA robot programmers with DST industrial apprenticeship completion.",
    tags: ["CNC", "PLC", "Robotics", "DST-Apprentice"],
    candidateCount: 32,
    filterCriteria: {
      skills: ["5-Axis CNC Milling", "PLC Ladder Logic", "Industrial Robotics Maintenance"],
      minReadinessScore: 80,
      locations: ["Pune", "Aurangabad"],
      hasVerifiedPassport: true,
    },
    candidateIds: ["cand-suresh-04", "cand-rahul-05"],
    createdAt: "2026-01-15T11:00:00Z",
    updatedAt: "2026-02-18T12:00:00Z",
  },
];

export const CANONICAL_WORKFORCE_FORECASTS: WorkforceForecastHorizon[] = [
  {
    horizonMonths: 3,
    projectedHeadcountDemand: 180,
    currentWorkforceCapacity: 155,
    projectedAttrition: 5,
    netHeadcountGap: 30,
    criticalSkillGaps: [
      { skillName: "Battery Management Systems (BMS)", missingHeadcount: 18 },
      { skillName: "High-Voltage Safety Protocols", missingHeadcount: 12 },
    ],
    recommendedBudgetINR: 4500000,
  },
  {
    horizonMonths: 6,
    projectedHeadcountDemand: 220,
    currentWorkforceCapacity: 150,
    projectedAttrition: 12,
    netHeadcountGap: 82,
    criticalSkillGaps: [
      { skillName: "Battery Management Systems (BMS)", missingHeadcount: 45 },
      { skillName: "Thermal Runaway Protocol", missingHeadcount: 22 },
      { skillName: "CANoe Vector Diagnostics", missingHeadcount: 15 },
    ],
    recommendedBudgetINR: 12500000,
  },
  {
    horizonMonths: 12,
    projectedHeadcountDemand: 310,
    currentWorkforceCapacity: 145,
    projectedAttrition: 25,
    netHeadcountGap: 190,
    criticalSkillGaps: [
      { skillName: "Battery Management Systems (BMS)", missingHeadcount: 95 },
      { skillName: "Automated Module Assembly", missingHeadcount: 55 },
      { skillName: "Power Electronics Calibration", missingHeadcount: 40 },
    ],
    recommendedBudgetINR: 28500000,
  },
];

export const CANONICAL_WORKFORCE_SCENARIOS: WorkforceScenarioSimulation[] = [
  {
    scenarioId: "scen-hire-direct-01",
    employerId: "emp-tata-motors",
    scenarioName: "Direct Market Recruitment (Chakan & Pune Corridor)",
    strategy: "HIRE_DIRECT",
    horizonMonths: 6,
    projectedHeadcountNeed: 82,
    workforceGap: 82,
    skillDeficitSummary: "Immediate hiring of 82 Level-5 EV Technicians from active local ITI/Diploma candidate pools.",
    estimatedCostINR: 14760000,
    timeToProductivityWeeks: 4,
    riskAssessment: "MODERATE",
    riskExplanation: "Regional market tightness: High competition from rival EV OEMs in Chakan may elevate wage offers by 15%.",
    disclaimer: "Modeled scenario based on regional supply-demand indices. Not a guaranteed outcome.",
  },
  {
    scenarioId: "scen-reskill-internal-02",
    employerId: "emp-tata-motors",
    scenarioName: "Internal Reskilling of ICE Powertrain Technicians",
    strategy: "INTERNAL_RESKILL",
    horizonMonths: 6,
    projectedHeadcountNeed: 82,
    workforceGap: 40,
    skillDeficitSummary: "Transition 42 internal mechanical technicians through 4-week high-voltage EV bridge training at ITI Aundh COE.",
    estimatedCostINR: 6300000,
    timeToProductivityWeeks: 6,
    riskAssessment: "LOW",
    riskExplanation: "Preserves organizational knowledge, achieves 95% retention, and reduces recruitment expenditure by 57%.",
    disclaimer: "Modeled scenario based on internal employee skill inventories and COE lab training capacity.",
  },
];

export const CANONICAL_RESKILLING_PATHWAYS: EmployerReskillingPathway[] = [
  {
    pathwayId: "path-ice-to-ev-01",
    sourceRoleTitle: "ICE Engine Assembly Technician",
    targetRoleTitle: "EV Battery System Calibration Specialist",
    eligibleEmployeeCount: 42,
    transferableSkills: ["Wiring Harness Inspection", "Digital Multimeters", "Torque Tool Calibration", "Shop-Floor Safety Standards"],
    gapSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Protocols (800V DC)", "CAN Bus Diagnostics"],
    recommendedCourseTitle: "ASDC Level-5 High-Voltage EV Conversion Certificate",
    trainingProviderName: "Government ITI Aundh (Centre of Excellence)",
    trainingDurationWeeks: 4,
    estimatedCostPerEmployeeINR: 150000,
    expectedProductivityRampWeeks: 2,
  },
];

export const CANONICAL_TRAINING_PARTNERS: TrainingPartnerDetail[] = [
  {
    providerId: "inst-iti-aundh-01",
    providerName: "Government ITI Aundh (EV Centre of Excellence)",
    providerType: "ITI",
    district: "Pune",
    state: "Maharashtra",
    relevantCourses: ["EV Battery Diagnostics & Repair", "Dual-System CNC Machining"],
    annualTraineeCapacity: 480,
    placementTrackRecordPercentage: 92.4,
    equipmentReadinessScore: 95,
    isNcvdAccredited: true,
  },
  {
    providerId: "inst-iti-ambattur-02",
    providerName: "Government ITI Ambattur",
    providerType: "ITI",
    district: "Chennai",
    state: "Tamil Nadu",
    relevantCourses: ["Automotive Mechatronics & EV Powertrain"],
    annualTraineeCapacity: 360,
    placementTrackRecordPercentage: 89.1,
    equipmentReadinessScore: 91,
    isNcvdAccredited: true,
  },
];

export const CANONICAL_EMPLOYER_SURVEY: EmployerSkillDemandSurvey = {
  surveyId: "surv-tata-2026-01",
  employerId: "emp-tata-motors",
  employerName: "Tata Motors Passenger Vehicles Ltd",
  respondentName: "Sanjay Deshmukh",
  respondentRole: "Head of Plant Technical Talent Acquisition",
  industry: "Automotive & Electric Mobility",
  cluster: "Chakan Industrial Zone",
  submissionDate: "2026-02-15T14:00:00Z",
  hiringOutlookNext12Months: "EXPANDING",
  topCriticalSkillsDemanded: [
    { skillName: "Battery Management Systems (BMS)", hiringNeedVolume: 95, urgency: "CRITICAL" },
    { skillName: "High-Voltage Safety Protocols", hiringNeedVolume: 60, urgency: "HIGH" },
    { skillName: "CAN Bus Diagnostics", hiringNeedVolume: 45, urgency: "HIGH" },
  ],
  satisfactionWithLocalGraduatesScore: 4.6,
  qualitativeFeedback: "ITI Aundh dual-training graduates exhibit superior safety discipline and zero high-voltage line incidents.",
  confidenceScore: 96,
};

export const CANONICAL_PLACEMENT_FEEDBACK: EmployerPlacementFeedbackRecord[] = [
  {
    feedbackId: "fb-rohit-01",
    employerId: "emp-tata-motors",
    employerName: "Tata Motors Passenger Vehicles Ltd",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    roleTitle: "EV Battery System Calibration Specialist",
    placementDate: "2025-10-01T09:00:00Z",
    technicalReadinessScore: 5,
    toolProficiencyScore: 5,
    workplaceSafetyCompliance: 5,
    retentionMilestone: "RETAINED_180D",
    comments: "Rohit resolved 18 complex BMS communication anomalies within his first 90 days. Top 5% of cohort.",
    submittedAt: "2026-02-10T11:00:00Z",
  },
];

export const CANONICAL_INDUSTRY_BENCHMARKS: EmployerIndustryBenchmark[] = [
  {
    metricName: "Time-to-Fill (Technical EV Roles)",
    employerValue: 22,
    industryAverage: 38,
    topQuartileBenchmark: 24,
    percentileRank: 92,
    sampleCohortSize: 140,
    unit: "DAYS",
    provenance: "CAREERIS Automotive Sector Hiring Index Q1 2026",
  },
  {
    metricName: "Candidate Skill Match Rate",
    employerValue: 91.5,
    industryAverage: 73.8,
    topQuartileBenchmark: 88.0,
    percentileRank: 94,
    sampleCohortSize: 140,
    unit: "PERCENTAGE",
    provenance: "CAREERIS Verified Skill Passport Requisition Matches",
  },
  {
    metricName: "365-Day Placement Retention",
    employerValue: 89.4,
    industryAverage: 68.2,
    topQuartileBenchmark: 84.5,
    percentileRank: 96,
    sampleCohortSize: 140,
    unit: "PERCENTAGE",
    provenance: "EPFO Verified Employment Continuity Records",
  },
];
