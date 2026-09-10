// ==============================================================================
// CAREERIS EMPLOYER OPERATIONS & WORKFORCE INTELLIGENCE TYPE SYSTEM
// Master Prompt 14: Talent Intelligence, Workforce Planning, Reskilling & Feedback
// ==============================================================================

import {
  JobType,
  EmployerVerificationStatus,
  RequisitionStatus,
  HiringPriority,
  RecruitmentPipelineStage,
  HiringDifficultyCategory,
} from "./employerIntelligence";

// ------------------------------------------------------------------------------
// 1. Talent Pools & Dynamic Criteria
// ------------------------------------------------------------------------------

export interface EmployerTalentPool {
  poolId: string;
  employerId: string;
  name: string;
  description: string;
  tags: string[];
  candidateCount: number;
  filterCriteria: {
    skills: string[];
    minReadinessScore?: number;
    locations?: string[];
    hasVerifiedPassport?: boolean;
  };
  candidateIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 2. Workforce Forecasting & Scenarios
// ------------------------------------------------------------------------------

export interface WorkforceForecastHorizon {
  horizonMonths: 3 | 6 | 12 | 24 | 36;
  projectedHeadcountDemand: number;
  currentWorkforceCapacity: number;
  projectedAttrition: number;
  netHeadcountGap: number;
  criticalSkillGaps: Array<{ skillName: string; missingHeadcount: number }>;
  recommendedBudgetINR: number;
}

export interface WorkforceScenarioSimulation {
  scenarioId: string;
  employerId: string;
  scenarioName: string;
  strategy: "HIRE_DIRECT" | "INTERNAL_RESKILL" | "AUTOMATION_TRANSFORMATION" | "OUTSOURCE_CONTINGENT" | "CLUSTER_EXPANSION";
  horizonMonths: number;
  projectedHeadcountNeed: number;
  workforceGap: number;
  skillDeficitSummary: string;
  estimatedCostINR: number;
  timeToProductivityWeeks: number;
  riskAssessment: "LOW" | "MODERATE" | "HIGH";
  riskExplanation: string;
  disclaimer: string;
}

// ------------------------------------------------------------------------------
// 3. Employer Reskilling Pathways & Training Discovery
// ------------------------------------------------------------------------------

export interface EmployerReskillingPathway {
  pathwayId: string;
  sourceRoleTitle: string;
  targetRoleTitle: string;
  eligibleEmployeeCount: number;
  transferableSkills: string[];
  gapSkills: string[];
  recommendedCourseTitle: string;
  trainingProviderName: string;
  trainingDurationWeeks: number;
  estimatedCostPerEmployeeINR: number;
  expectedProductivityRampWeeks: number;
}

export interface TrainingPartnerDetail {
  providerId: string;
  providerName: string;
  providerType: "ITI" | "POLYTECHNIC" | "NSDC_PARTNER" | "OEM_ACADEMY";
  district: string;
  state: string;
  relevantCourses: string[];
  annualTraineeCapacity: number;
  placementTrackRecordPercentage: number;
  equipmentReadinessScore: number;
  isNcvdAccredited: boolean;
}

// ------------------------------------------------------------------------------
// 4. Employer Survey & Post-Placement Feedback Loop
// ------------------------------------------------------------------------------

export interface EmployerSkillDemandSurvey {
  surveyId: string;
  employerId: string;
  employerName: string;
  respondentName: string;
  respondentRole: string;
  industry: string;
  cluster: string;
  submissionDate: string;
  hiringOutlookNext12Months: "EXPANDING" | "STABLE" | "CONTRACTING";
  topCriticalSkillsDemanded: Array<{ skillName: string; hiringNeedVolume: number; urgency: HiringPriority }>;
  satisfactionWithLocalGraduatesScore: number; // 1 - 5
  qualitativeFeedback: string;
  confidenceScore: number;
}

export interface EmployerPlacementFeedbackRecord {
  feedbackId: string;
  employerId: string;
  employerName: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  placementDate: string;
  technicalReadinessScore: number; // 1 - 5
  toolProficiencyScore: number;    // 1 - 5
  workplaceSafetyCompliance: number;// 1 - 5
  retentionMilestone: "RETAINED_30D" | "RETAINED_90D" | "RETAINED_180D" | "RETAINED_365D" | "ATTRITED";
  comments: string;
  submittedAt: string;
}

// ------------------------------------------------------------------------------
// 5. Industry Anonymous Benchmarking
// ------------------------------------------------------------------------------

export interface EmployerIndustryBenchmark {
  metricName: string;
  employerValue: number;
  industryAverage: number;
  topQuartileBenchmark: number;
  percentileRank: number;
  sampleCohortSize: number;
  unit: "DAYS" | "PERCENTAGE" | "INR" | "SCORE";
  provenance: string;
}

// ------------------------------------------------------------------------------
// 6. Grounded Employer Copilot Advisor
// ------------------------------------------------------------------------------

export interface GroundedEmployerAdvisorResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  marketSupplySignal: string;
  recommendedAction: string;
  confidenceScore: number;
  limitations: string;
}
