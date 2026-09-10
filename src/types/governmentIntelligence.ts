// ==============================================================================
// CAREERIS GOVERNMENT INTELLIGENCE DOMAIN TYPE SYSTEM
// Policy Intelligence, District Action, Intervention Management & Budget Outcomes
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Government Roles & Geographic Scope
// ------------------------------------------------------------------------------

export type GovernmentScopeType = "NATIONAL" | "STATE" | "DIVISION" | "DISTRICT" | "PROGRAM" | "CLUSTER";

export interface GovernmentUserScope {
  scopeType: GovernmentScopeType;
  stateCode?: string;      // e.g. "MH", "KA", "TN", "DL", "GJ"
  stateName?: string;
  divisionName?: string;
  districtId?: string;     // e.g. "dist-pune", "dist-bengaluru-urban"
  districtName?: string;
  programId?: string;      // e.g. "prog-pmkvy-4", "prog-mssds-pilot"
  clusterId?: string;
}

// ------------------------------------------------------------------------------
// 2. Government Program & Scheme Management
// ------------------------------------------------------------------------------

export type ProgramStatus = "ACTIVE" | "UPCOMING" | "COMPLETED" | "PAUSED" | "EVALUATION";

export interface ProgramKPI {
  kpiId: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: "ON_TRACK" | "AT_RISK" | "BEHIND" | "ACHIEVED";
}

export interface GovernmentProgram {
  id: string;
  name: string;
  schemeCode: "PMKVY_4" | "DDU_GKY" | "NAPS" | "STRIVE" | "STATE_SKILL_MISSION" | "SECTOR_COE";
  schemeName: string;
  department: string;
  scopeType: GovernmentScopeType;
  targetStateCode?: string;
  targetDistrictId?: string;
  targetIndustryIds: string[];
  targetSkillIds: string[];
  targetRoles: string[];
  budgetAllocatedINR: number;
  budgetSpentINR: number;
  startDate: string;
  endDate: string;
  status: ProgramStatus;
  leadAgency: string;
  enrolledBeneficiariesCount: number;
  completedTrainingCount: number;
  certifiedCount: number;
  verifiedSkillHoldersCount: number;
  placedCount: number;
  kpis: ProgramKPI[];
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// 3. Government Interventions (11-Stage Full Lifecycle)
// ------------------------------------------------------------------------------

export type GovernmentInterventionStatus =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "FUNDED"
  | "IN_PROGRESS"
  | "MONITORING"
  | "COMPLETED"
  | "EVALUATED"
  | "REJECTED"
  | "CANCELLED"
  | "ON_HOLD";

export type InterventionType =
  | "SEAT_EXPANSION"
  | "SEAT_REDUCTION"
  | "TRAINER_RETRAINING"
  | "TRAINER_RECRUITMENT"
  | "LAB_EQUIPMENT_UPGRADE"
  | "CURRICULUM_REVISION"
  | "COE_PARTNERSHIP"
  | "APPRENTICESHIP_DRIVE"
  | "RURAL_ACCESS_MOBILITY"
  | "ASSESSMENT_CAPACITY_BOOST";

export interface GovernmentIntervention {
  id: string;
  programId?: string;
  title: string;
  type: InterventionType;
  description: string;
  problemStatement: string;
  rootSignal: string;
  geographyScope: GovernmentScopeType;
  stateCode: string;
  stateName: string;
  districtId: string;
  districtName: string;
  clusterName?: string;
  targetSkillId?: string;
  targetSkillName?: string;
  targetRoleId?: string;
  targetRoleTitle?: string;
  responsibleAgency: string;
  ownerOfficerName: string;
  ownerOfficerEmail: string;
  budgetINR: number;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: GovernmentInterventionStatus;
  metricName: string;
  baselineValue: number;
  targetValue: number;
  actualValue?: number;
  achievementPercentage?: number;
  variancePercentage?: number;
  confidenceScore: number;
  evidenceSources: string[];
  riskSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  approvalChain: Array<{
    stage: GovernmentInterventionStatus;
    actedBy: string;
    actedAt: string;
    notes?: string;
  }>;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// 4. Budget Intelligence & Cost-to-Outcome Governance
// ------------------------------------------------------------------------------

export interface BudgetAllocation {
  id: string;
  fiscalYear: string; // e.g. "FY 2025-26"
  schemeCode: string;
  programId?: string;
  geographyScope: GovernmentScopeType;
  stateCode?: string;
  districtId?: string;
  allocatedINR: number;
  committedINR: number;
  releasedINR: number;
  spentINR: number;
  remainingINR: number;
  utilizationPercentage: number;
  linkedInterventionsCount: number;
}

export interface BudgetOutcomeMetrics {
  totalBudgetSpentINR: number;
  totalTraineesEnrolled: number;
  totalCompletions: number;
  totalVerifiedSkillHolders: number;
  totalPlacements: number;
  costPerTraineeINR: number;
  costPerCompletionINR: number;
  costPerVerifiedCandidateINR: number;
  costPerPlacementINR: number;
  placementOutcomeRatePercentage: number;
  employerSatisfactionIndex: number; // 0 - 100
  reportingPeriod: string;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// 5. District Skill Gap Matrix & Priority Scoring Engine
// ------------------------------------------------------------------------------

export type DistrictGapClassification = "SURPLUS" | "BALANCED" | "MODERATE_GAP" | "HIGH_GAP" | "CRITICAL_GAP";

export interface DistrictSkillMatrixCell {
  skillId: string;
  skillName: string;
  roleId?: string;
  roleTitle?: string;
  annualEmployerDemand: number;
  annualVerifiedSupply: number;
  netGap: number;
  gapClassification: DistrictGapClassification;
  demandSupplyRatio: number;
  hiringDifficulty: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  trainingCapacitySeats: number;
}

export interface DistrictSkillGapMatrixRow {
  districtId: string;
  districtName: string;
  stateCode: string;
  stateName: string;
  industrialCluster?: string;
  priorityScore: number; // 0 - 100
  priorityCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  topShortageSkill: string;
  activeInterventionsCount: number;
  skills: Record<string, DistrictSkillMatrixCell>;
}

export interface DistrictPriorityCalculation {
  districtId: string;
  districtName: string;
  stateCode: string;
  priorityScore: number; // 0 - 100
  priorityCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  factors: {
    skillShortageMagnitude: { score: number; weight: number; value: string };
    employerDemandIntensity: { score: number; weight: number; value: string };
    trainingUnderCapacity: { score: number; weight: number; value: string };
    placementDeficit: { score: number; weight: number; value: string };
    trainerAndLabGaps: { score: number; weight: number; value: string };
    emergingSkillPressure: { score: number; weight: number; value: string };
  };
  keyDataSources: string[];
  recommendedPolicyFocus: string;
}

// ------------------------------------------------------------------------------
// 6. District Risk Engine & Early Warnings
// ------------------------------------------------------------------------------

export type DistrictRiskCategory =
  | "SKILL_SHORTAGE"
  | "TRAINING_UNDERCAPACITY"
  | "TRAINER_SHORTAGE"
  | "EQUIPMENT_FAILURE"
  | "CURRICULUM_OBSOLESCENCE"
  | "LOW_PLACEMENT"
  | "LOW_EMPLOYER_PARTICIPATION"
  | "ACCESS_GAP"
  | "DATA_QUALITY";

export interface DistrictRiskItem {
  id: string;
  districtId: string;
  districtName: string;
  stateCode: string;
  riskCategory: DistrictRiskCategory;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  evidence: string;
  affectedSkills: string[];
  affectedInstitutesCount: number;
  affectedSeats: number;
  detectedAt: string;
  suggestedAction: string;
}

export interface EarlyWarningAlert {
  id: string;
  alertType: "DEMAND_SPIKE" | "SUPPLY_CLIFF" | "EQUIPMENT_BREAKDOWN" | "PLACEMENT_DROP" | "OBSOLETE_CURRICULUM";
  severity: "WARNING" | "CRITICAL" | "INFO";
  geography: string;
  stateCode: string;
  districtName?: string;
  metric: string;
  changePercentage: number;
  observationPeriod: string;
  evidenceText: string;
  dataSource: string;
  confidenceScore: number;
  timestamp: string;
}

// ------------------------------------------------------------------------------
// 7. Policy Recommendations & What-If Scenarios
// ------------------------------------------------------------------------------

export interface PolicyRecommendation {
  id: string;
  title: string;
  problem: string;
  evidence: string[];
  rootSignal: string;
  geographyScope: GovernmentScopeType;
  targetStateCode: string;
  targetDistrictName?: string;
  targetSkills: string[];
  affectedPopulation: number;
  options: Array<{
    optionName: string;
    description: string;
    estimatedCostINR: number;
    expectedImpact: string;
    risk: "LOW" | "MEDIUM" | "HIGH";
  }>;
  recommendedAction: string;
  expectedOutcome: string;
  confidenceScore: number;
  sources: string[];
  requiresHumanApproval: true;
  generatedAt: string;
}

export interface PolicyScenarioRequest {
  scenarioTitle: string;
  geographyScope: GovernmentScopeType;
  stateCode: string;
  districtId?: string;
  adjustments: {
    trainingSeatCapacityDeltaPercent?: number;  // e.g. +20%
    trainerCountDelta?: number;                 // e.g. +15
    labEquipmentUpgrade?: boolean;
    curriculumRevisionApplied?: boolean;
    employerCoEApprenticeshipCreated?: boolean;
  };
  targetSkillId: string;
}

export interface PolicyScenarioComparisonResult {
  label: "SIMULATION";
  disclaimer: "THIS IS A POLICY SCENARIO SIMULATION GROUNDED IN HISTORICAL SUPPLY/DEMAND ELASTICITY. NOT AN ACTUAL GUARANTEED OUTCOME.";
  scenarioId: string;
  scenarioTitle: string;
  baseline: {
    demand: number;
    supply: number;
    netGap: number;
    placementRate: number;
    estimatedBudgetINR: number;
  };
  projected: {
    demand: number;
    supply: number;
    netGap: number;
    placementRate: number;
    estimatedBudgetINR: number;
  };
  impactSummary: string;
  roiAssessment: string;
  confidence: number;
  generatedAt: string;
}

// ------------------------------------------------------------------------------
// 8. Grounded AI Policy Copilot
// ------------------------------------------------------------------------------

export interface AIPolicyCopilotQuery {
  userRole: UserRole;
  userScope: GovernmentUserScope;
  query: string;
  contextStateCode?: string;
  contextDistrictId?: string;
  contextSkillId?: string;
}

export interface AIPolicyCopilotResponse {
  answer: string;
  groundingLabel: "FACT" | "ANALYSIS" | "FORECAST" | "SIMULATION" | "RECOMMENDATION" | "DATA_LIMITATION";
  groundingData: {
    statesReferenced?: string[];
    districtsReferenced?: string[];
    skillsReferenced?: string[];
    programsReferenced?: string[];
    sourcesUsed: string[];
  };
  suggestedFollowUpActions?: Array<{ title: string; actionUrl: string }>;
  policyOptions?: string[];
}

export interface IPolicyAIProvider {
  askCopilot(query: AIPolicyCopilotQuery): Promise<AIPolicyCopilotResponse>;
}
