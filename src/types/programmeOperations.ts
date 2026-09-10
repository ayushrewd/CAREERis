// ==============================================================================
// CAREERIS PROGRAMME OPERATIONS & IMPACT MEASUREMENT DOMAIN TYPES
// Master Prompt 12: National Programme Management, Budgets, Milestones & Command Center
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Programme Lifecycle & Architecture
// ------------------------------------------------------------------------------

export type ProgrammeLifecycleStatus =
  | "DRAFT"
  | "DESIGNED"
  | "APPROVED"
  | "FUNDED"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CLOSED"
  | "EVALUATED";

export type ProgrammeScopeLevel = "NATIONAL" | "STATE" | "DISTRICT" | "CLUSTER";

export interface TheoryOfChange {
  inputs: string[];      // e.g. ["Capital grant ₹50 Cr", "OEM battery test rigs", "Master trainer cadre"]
  activities: string[];  // e.g. ["Establish 4 EV COE labs", "Retrain 120 ITI instructors", "Launch 6-month dual curriculum"]
  outputs: string[];     // e.g. ["2,400 candidates trained", "85% pass NCVT assessment", "120 trainers certified"]
  outcomes: string[];    // e.g. ["78% placement in Tier-1 EV OEMs", "92% 180-day retention", "Zero rework in battery pack assembly"]
  impact: string[];      // e.g. ["Accelerate India EV transition", "Increase average technician starting wage by 35%"]
}

export type KPICategory = "OUTPUT" | "OUTCOME" | "IMPACT" | "EFFICIENCY" | "EQUITY" | "QUALITY";
export type KPIStatus = "ON_TRACK" | "AT_RISK" | "OFF_TRACK" | "COMPLETED" | "NO_DATA";

export interface ProgrammeKPI {
  kpiId: string;
  programmeId: string;
  metricName: string;
  category: KPICategory;
  formula: string;
  unit: string;
  baselineValue: number | null;
  targetValue: number;
  currentValue: number | null;
  status: KPIStatus;
  period: string;
  dataSource: string;
  confidence: number;
  owner: string;
}

export interface Programme {
  programmeId: string;
  code: string;
  name: string;
  schemeName: string;
  department: string;
  leadAgency: string;
  scopeLevel: ProgrammeScopeLevel;
  stateCode?: string;
  districtId?: string;
  targetSkillIds: string[];
  targetRoleIds: string[];
  targetIndustryIds: string[];
  problemStatement: string;
  targetPopulationDescription: string;
  theoryOfChange: TheoryOfChange;
  status: ProgrammeLifecycleStatus;
  startDate: string;
  endDate: string;
  totalBudgetINR: number;
  allocatedBudgetINR: number;
  utilizedBudgetINR: number;
  kpis: ProgrammeKPI[];
  createdAt: string;
  updatedAt: string;
  ownerUserId: string;
  ownerName: string;
}

// ------------------------------------------------------------------------------
// 2. Budget Intelligence & Cost-per-Outcome
// ------------------------------------------------------------------------------

export type BudgetLifecycleStatus =
  | "PROPOSED"
  | "ALLOCATED"
  | "COMMITTED"
  | "RELEASED"
  | "UTILIZED"
  | "RECONCILED"
  | "CLOSED";

export type FundingSourceType =
  | "GOVERNMENT_CENTRAL"
  | "GOVERNMENT_STATE"
  | "CSR_INDUSTRY"
  | "MULTILATERAL_WORLD_BANK"
  | "INSTITUTION_OWN_FUNDS";

export interface FundingSource {
  sourceId: string;
  name: string;
  type: FundingSourceType;
  committedAmountINR: number;
  releasedAmountINR: number;
}

export type BudgetVarianceStatus = "UNDERSPEND" | "ON_PLAN" | "OVERSPEND" | "NO_DATA";

export interface BudgetLine {
  lineId: string;
  category: "TRAINING_SEATS" | "LAB_EQUIPMENT" | "TRAINER_HONORARIUM" | "ASSESSMENT_FEES" | "PLACEMENT_INCENTIVES" | "ADMINISTRATION";
  budgetedINR: number;
  actualSpentINR: number;
  committedINR: number;
  varianceINR: number;
  variancePercentage: number;
  varianceStatus: BudgetVarianceStatus;
  correctiveAction?: string;
}

export interface CostPerOutcomeMetrics {
  costPerTraineeINR: number;
  costPerCertifiedCandidateINR: number;
  costPerPlacedCandidateINR: number;
  costPerRetainedCandidate365dINR: number;
  costPerVerifiedSkillAttainedINR: number;
  isFinancialROIExpressed: boolean;
  methodologyNote: string;
}

export interface ProgrammeBudget {
  budgetId: string;
  programmeId: string;
  financialYear: string;
  status: BudgetLifecycleStatus;
  allocatedAmountINR: number;
  committedAmountINR: number;
  releasedAmountINR: number;
  utilizedAmountINR: number;
  remainingAmountINR: number;
  utilizationPercentage: number;
  burnRateINRPerMonth: number;
  fundingSources: FundingSource[];
  budgetLines: BudgetLine[];
  costPerOutcome: CostPerOutcomeMetrics;
  lastAuditedAt: string;
}

// ------------------------------------------------------------------------------
// 3. Intervention Execution & Milestone Dependency Graph
// ------------------------------------------------------------------------------

export type InterventionMilestoneStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "AT_RISK"
  | "COMPLETED"
  | "OVERDUE";

export interface InterventionMilestone {
  milestoneId: string;
  interventionId: string;
  title: string;
  ownerName: string;
  dueDate: string;
  status: InterventionMilestoneStatus;
  dependsOnMilestoneId?: string;
  completionPercentage: number;
  evidenceUri?: string;
  riskNote?: string;
}

export interface InterventionExplainabilityScore {
  skillDeficitImpactScore: number;  // 0-100
  demandIntensityScore: number;      // 0-100
  trainingCapacityReadiness: number; // 0-100
  placementProbability: number;      // 0-100
  costEfficiencyRatio: number;       // 0-100
  compositePriorityScore: number;    // 0-100
  whyThisIntervention: string;
  primaryAssumptions: string[];
}

export interface InterventionExecution {
  interventionId: string;
  programmeId?: string;
  title: string;
  category: "CAPACITY_EXPANSION" | "CURRICULUM_MODERNIZATION" | "TRAINER_UPSKILLING" | "LAB_EQUIPMENT_PROCUREMENT" | "INDUSTRY_APPRENTICESHIP";
  stateCode: string;
  districtId: string;
  clusterId?: string;
  targetSkillIds: string[];
  targetRoleIds: string[];
  targetPopulation: string;
  estimatedCapacity: number;
  allocatedBudgetINR: number;
  status: "PROPOSED" | "UNDER_REVIEW" | "APPROVED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "REJECTED" | "CANCELLED" | "EVALUATED";
  dependsOnInterventionIds: string[];
  milestones: InterventionMilestone[];
  explainability: InterventionExplainabilityScore;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 4. Beneficiary Funnel & Multi-Horizon Retention
// ------------------------------------------------------------------------------

export interface PlacementQuality {
  roleRelevanceScore: number;       // 0-100
  skillRelevanceScore: number;      // 0-100
  medianStartingSalaryINRMonth: number;
  formalSectorEmploymentRate: number; // %
  greenJobPlacementRate: number;     // %
}

export interface BeneficiaryFunnel {
  programmeId: string;
  totalEligible: number;
  enrolled: number;
  trainingStarted: number;
  trainingCompleted: number;
  assessed: number;
  certified: number;
  placed: number;
  retained30d: number;
  retained90d: number;
  retained180d: number;
  retained365d: number;
  placementQuality: PlacementQuality;
  retentionRate365dPercentage: number;
  drilldownByGender: {
    male: { enrolled: number; placed: number; retained365d: number };
    female: { enrolled: number; placed: number; retained365d: number };
  };
}

// ------------------------------------------------------------------------------
// 5. Programme Risk Register & 5x5 Heatmap
// ------------------------------------------------------------------------------

export type ProgrammeRiskCategory =
  | "FUNDING"
  | "CAPACITY"
  | "TRAINING"
  | "EMPLOYER"
  | "DEMAND"
  | "INFRASTRUCTURE"
  | "TECHNOLOGY"
  | "DATA"
  | "IMPLEMENTATION";

export interface ProgrammeRisk {
  riskId: string;
  programmeId: string;
  riskTitle: string;
  category: ProgrammeRiskCategory;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskScore: number; // probability * impact (1-25)
  status: "IDENTIFIED" | "MITIGATED" | "ESCALATED" | "CLOSED";
  mitigationStrategy: string;
  ownerName: string;
  reviewDate: string;
}

// ------------------------------------------------------------------------------
// 6. Decision Register & Four-Eyes Approval Workflow
// ------------------------------------------------------------------------------

export type DecisionType =
  | "BUDGET_ALLOCATION"
  | "PROGRAMME_APPROVAL"
  | "INTERVENTION_APPROVAL"
  | "INTERVENTION_CANCELLATION"
  | "TARGET_REVISION";

export interface DecisionRecord {
  decisionId: string;
  decisionType: DecisionType;
  targetEntityId: string;
  targetEntityName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  approverId?: string;
  approverName?: string;
  approverRole?: UserRole;
  status: "PROPOSED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "APPLIED";
  reason: string;
  evidenceSummary: string;
  fourEyesEnforced: boolean;
  requestedAt: string;
  approvedAt?: string;
}

// ------------------------------------------------------------------------------
// 7. Outcome Evaluation & Attribution Methodologies
// ------------------------------------------------------------------------------

export type EvaluationMethodology =
  | "DESCRIPTIVE"
  | "BEFORE_AFTER"
  | "COHORT"
  | "COMPARATIVE"
  | "EXPERIMENTAL"
  | "QUASI_EXPERIMENTAL";

export interface OutcomeEvaluation {
  evaluationId: string;
  programmeId: string;
  evaluationType: EvaluationMethodology;
  baselineMetrics: Record<string, number>;
  postInterventionMetrics: Record<string, number>;
  observedImpactSummary: string;
  confidenceLevel: number; // 0-100
  dataCompletenessPercentage: number;
  causalityDisclaimer: string;
  keyRecommendations: string[];
  evaluatedAt: string;
  leadEvaluator: string;
}

// ------------------------------------------------------------------------------
// 8. Executive Command Center 9-Answer Engine & ESG
// ------------------------------------------------------------------------------

export interface ExecutiveCommandCenterDigest {
  whatIsHappening: string;
  whyIsItHappening: string;
  whereIsItHappening: string;
  whoIsAffected: string;
  whatShouldWeDo: string;
  whatIsAlreadyBeingDone: string;
  isItWorking: string;
  howMuchDoesItCost: string;
  whatIsAtRisk: string;
  topImprovements: string[];
  topDeteriorations: string[];
  criticalAlertsCount: number;
  totalActiveProgrammes: number;
  totalCommittedBudgetINR: number;
  overallPlacementRatePercentage: number;
  overall365dRetentionRatePercentage: number;
}

export interface ESGAndGreenSkillsSummary {
  greenSkillsDemandIndex: number;
  greenTrainingCapacityTotal: number;
  greenJobPlacementsCount: number;
  socialEquityInclusionRate: number; // % female/marginalized
  governanceComplianceScore: number; // % audited decisions & four-eyes adherence
}
