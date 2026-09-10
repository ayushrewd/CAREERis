// ==============================================================================
// CAREERIS PREDICTIVE INTELLIGENCE DOMAIN TYPE SYSTEM
// National Forecasting, Skill Adoption, Career Trajectory, Scenarios & Copilot
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Core Forecasting & Horizon Types
// ------------------------------------------------------------------------------

export type ForecastHorizon = "3M" | "6M" | "12M" | "24M" | "36M";

export type ForecastTrend =
  | "RISING"
  | "STABLE"
  | "DECLINING"
  | "VOLATILE"
  | "INSUFFICIENT_DATA";

export type OutputClassification =
  | "FACT"
  | "FORECAST"
  | "INFERENCE"
  | "RECOMMENDATION"
  | "SCENARIO"
  | "SIMULATION"
  | "DATA_LIMITATION";

export interface ForecastDataPoint {
  date: string; // YYYY-MM
  actualDemand?: number;
  projectedDemand: number;
  lowerConfidenceBound: number;
  upperConfidenceBound: number;
  confidenceScore: number; // 0 - 1.0
}

export interface LabourDemandForecast {
  id: string;
  scope: "NATIONAL" | "STATE" | "DISTRICT" | "CLUSTER" | "INDUSTRY";
  scopeEntityId: string;
  scopeEntityName: string;
  currentDemand: number;
  forecastDemand: number;
  absoluteChange: number;
  percentageChange: number;
  trend: ForecastTrend;
  forecastHorizon: ForecastHorizon;
  confidenceScore: number; // 0 - 1.0
  historicalData: Array<{ date: string; demand: number }>;
  projections: ForecastDataPoint[];
  majorDriverSignals: string[];
  limitations: string[];
  lastUpdated: string;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// 2. Skill Prediction, Adoption Curves & Obsolescence
// ------------------------------------------------------------------------------

export type SkillAdoptionStage =
  | "EARLY_SIGNAL"
  | "EARLY_ADOPTION"
  | "ACCELERATION"
  | "MAINSTREAM"
  | "MATURING"
  | "DECLINING";

export interface SkillDemandForecast {
  skillId: string;
  skillName: string;
  categoryName: string;
  currentAnnualDemand: number;
  projectedAnnualDemand: number;
  growthRatePercentage: number;
  adoptionStage: SkillAdoptionStage;
  employerAdoptionVelocity: number; // 0 - 100
  crossIndustryDiffusionIndex: number; // 0 - 100
  trainingSupplyLagMonths: number;
  projections: ForecastDataPoint[];
  obsolescenceRisk: {
    level: "LOW_RISK" | "WATCH" | "HIGH_RISK" | "CRITICAL";
    signals: string[];
    potentialSubstitutes: Array<{ skillId: string; skillName: string; similarityScore: number }>;
  };
  adjacentSkills: Array<{ skillId: string; skillName: string; relationship: "PREREQUISITE" | "COMPLEMENTARY" | "ADJACENT" }>;
  forecastConfidence: number;
}

export interface FutureSkillBundle {
  bundleId: string;
  bundleName: string;
  skills: Array<{ skillId: string; skillName: string }>;
  targetRoles: string[];
  demandingIndustries: string[];
  coOccurrenceScore: number; // 0 - 100
  projectedGrowthYoY: number;
  trainingCourseIds: string[];
}

// ------------------------------------------------------------------------------
// 3. Career Trajectory & Career Transition Engine
// ------------------------------------------------------------------------------

export type TransferabilityScore = "DIRECTLY_TRANSFERABLE" | "PARTIALLY_TRANSFERABLE" | "REQUIRES_ADDITIONAL_TRAINING";

export interface CareerTrajectoryNode {
  stepIndex: number;
  stepType: "CURRENT_ROLE" | "SKILL_ACQUISITION" | "ASSESSMENT_VERIFICATION" | "APPRENTICESHIP" | "TARGET_ROLE" | "CAREER_GROWTH";
  title: string;
  description: string;
  durationMonths: number;
  skillsToAcquire?: Array<{ skillId: string; skillName: string }>;
  recommendedCourseId?: string;
  recommendedCourseName?: string;
  estimatedReadinessScore: number;
  potentialSalaryRangeINR?: { min: number; max: number };
}

export interface CareerTrajectoryPath {
  pathId: string;
  candidateId?: string;
  targetRoleTitle: string;
  targetIndustry: string;
  feasibilityScore: number; // 0 - 100
  timeHorizonMonths: number;
  steps: CareerTrajectoryNode[];
  overallReadinessPercentage: number;
  whyThisPath: string[];
  disclaimer: "Potential pathway based on live skill graph analysis. Not a guarantee of employment.";
}

export interface CareerTransitionAnalysis {
  currentRole: string;
  targetRole: string;
  overallMatchScore: number; // 0 - 100
  transferableSkills: Array<{ skillName: string; transferability: TransferabilityScore; rationale: string }>;
  gapSkills: Array<{ skillName: string; priority: "CRITICAL" | "HIGH" | "MEDIUM"; recommendedTraining: string }>;
  estimatedTransitionDurationWeeks: number;
}

// ------------------------------------------------------------------------------
// 4. Employer Talent Scarcity & Future Gaps
// ------------------------------------------------------------------------------

export interface TalentScarcityForecast {
  industry: string;
  districtName: string;
  stateCode: string;
  hiringDifficultyIndex: number; // 0 - 100 (100 = severe scarcity)
  marketCondition: "CRITICAL_SHORTAGE" | "MODERATE_SHORTAGE" | "BALANCED" | "SURPLUS";
  projected12MDemand: number;
  projected12MSupply: number;
  netProjectedDeficit: number;
  scarceSkills: Array<{ skillName: string; hiringTimeWeeks: number; wageInflationPremiumYoY: number }>;
}

// ------------------------------------------------------------------------------
// 5. Training Future-Fit & Infrastructure Forecasting
// ------------------------------------------------------------------------------

export interface CurriculumFutureFitEvaluation {
  courseId: string;
  courseTitle: string;
  futureFitScore: number; // 0 - 100
  futureFitGrade: "FUTURE_READY" | "NEEDS_UPDATE" | "HIGH_RISK" | "CRITICAL_UPDATE";
  currentCurriculumSkills: string[];
  futureMarketDemandedSkills: string[];
  trainerCompetenciesForecast: Array<{ skillName: string; facultyGap: number }>;
  equipmentDemandForecast: Array<{ equipmentCategory: string; upgradeHorizonMonths: number }>;
}

// ------------------------------------------------------------------------------
// 6. What-If Policy Scenario Engine
// ------------------------------------------------------------------------------

export interface PredictiveScenarioSimulation {
  label: "SIMULATION ONLY";
  scenarioId: string;
  scenarioName: string;
  targetScope: string;
  assumptions: Record<string, any>;
  baselineMetrics: { seats: number; supply: number; demand: number; placement: number };
  projectedMetrics: { seats: number; supply: number; demandCoveragePercentage: number; placements: number };
  deltaImpact: { seatsDelta: number; supplyDelta: number; placementsDelta: number; estimatedCostINR: number };
  riskSignals: string[];
  generatedAt: string;
}

// ------------------------------------------------------------------------------
// 7. Early Warning & Signal Fusion
// ------------------------------------------------------------------------------

export type SignalFusionStatus = "CONSISTENT" | "WEAK_SIGNAL" | "CONFLICTING_SIGNALS" | "INSUFFICIENT_DATA";

export interface PredictiveEarlyWarningAlert {
  alertId: string;
  trigger: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  signalFusionStatus: SignalFusionStatus;
  affectedGeography: string;
  affectedSkills: string[];
  affectedRoles: string[];
  evidenceData: string;
  recommendedIntervention: string;
  confidenceScore: number;
  detectedAt: string;
}

// ------------------------------------------------------------------------------
// 8. Forecast Model Registry & Drift
// ------------------------------------------------------------------------------

export interface ForecastModelRecord {
  modelId: string;
  modelName: string;
  version: string;
  algorithm: string;
  forecastHorizon: ForecastHorizon;
  metrics: { mae: number; rmse: number; mapePercentage: number; calibrationScore: number };
  status: "ACTIVE" | "SHADOW" | "DISABLED";
  driftStatus: "HEALTHY" | "WATCH" | "DEGRADED" | "DISABLED";
  lastTrainedAt: string;
  lastEvaluatedAt: string;
}

// ------------------------------------------------------------------------------
// 9. Role-Aware Grounded CareerIS Intelligence Copilot
// ------------------------------------------------------------------------------

export interface CareerISCopilotQuery {
  userRole: UserRole;
  query: string;
  targetGeography?: string;
  targetSkillId?: string;
  targetRoleId?: string;
}

export interface CareerISCopilotStructuredResponse {
  answer: string;
  why: string[];
  evidence: Array<{ dataset: string; date: string; geography: string; metric: string; confidence: number }>;
  whatItMeans: string;
  recommendedAction: string;
  confidenceScore: number; // 0 - 1.0
  classification: OutputClassification;
  limitations: string[];
  suggestedFollowUps?: string[];
}

export interface ICareerISCopilotProvider {
  ask(query: CareerISCopilotQuery): Promise<CareerISCopilotStructuredResponse>;
}
