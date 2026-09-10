// ==============================================================================
// CAREERIS LABOUR-MARKET DECISION INTELLIGENCE TYPE SYSTEM
// Everything connects through Canonical Skills
// ==============================================================================

export type CourseHealthClassification =
  | "EXCELLENT"
  | "HEALTHY"
  | "WATCH"
  | "AT_RISK"
  | "CRITICAL"
  | "INSUFFICIENT_DATA";

export interface CourseHealthComponentScores {
  marketDemandAlignment: number;    // 0 - 100
  skillAlignment: number;           // 0 - 100
  placementPerformance: number;     // 0 - 100
  curriculumFreshness: number;      // 0 - 100
  employerSatisfaction: number;     // 0 - 100
  emergingSkillCoverage: number;    // 0 - 100
  capacityUtilization: number;      // 0 - 100
}

export interface CourseHealthProfile {
  courseId: string;
  courseTitle: string;
  providerId: string;
  providerName: string;
  district: string;
  state: string;
  overallScore: number;             // 0 - 100
  classification: CourseHealthClassification;
  components: CourseHealthComponentScores;
  weightVersion: string;
  confidence: number;               // 0.0 - 1.0
  period: string;
  sources: string[];
  rationale: string;
  isDemoData: boolean;
}

export type ObsolescenceRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface CourseObsolescenceProfile {
  courseId: string;
  courseTitle: string;
  providerName: string;
  district: string;
  state: string;
  riskLevel: ObsolescenceRiskLevel;
  riskScore: number;                // 0 - 100
  signals: {
    demandDeclineRateYoY: number;
    placementRate: number;
    annualGraduateOutput: number;
    employerHiringInterest: "HIGH" | "MODERATE" | "LOW" | "NEGLIGIBLE";
    technologySubstitutionRisk: boolean;
    outdatedSkillsCount: number;
    curriculumAgeYears: number;
  };
  evidence: string[];
  confidence: number;
  recommendedReviewAction:
    | "CURRICULUM_MODERNIZATION"
    | "ELECTIVE_SKILL_REFRESH"
    | "LAB_EQUIPMENT_UPGRADE"
    | "GOVERNANCE_REVIEW_REQUIRED"
    | "NO_ACTION_REQUIRED";
  isDemoData: boolean;
}

export type OversupplyClassification =
  | "BALANCED"
  | "WATCH"
  | "OVERSUPPLIED"
  | "SEVERELY_OVERSUPPLIED"
  | "INSUFFICIENT_DATA";

export interface CourseOversupplyProfile {
  courseId: string;
  courseTitle: string;
  providerName: string;
  district: string;
  state: string;
  annualSeats: number;
  completionRate: number;
  graduateOutput: number;
  relevantDemand: number;
  placementRate: number;
  oversupplyRatio: number;          // Graduate Output / Relevant Demand
  classification: OversupplyClassification;
  transferableSkills: Array<{ skillId: string; skillName: string; alternativeDemand: number }>;
  confidence: number;
  recommendedAction: string;
  isDemoData: boolean;
}

export type CapacityUtilizationStatus =
  | "OPTIMAL"
  | "MODERATE"
  | "LOW_UTILIZATION"
  | "SEVERE_UNDERUTILIZATION";

export interface TrainingCapacityMetrics {
  providerId: string;
  providerName: string;
  courseId: string;
  courseTitle: string;
  district: string;
  state: string;
  period: string;
  approvedSeats: number;
  activeSeats: number;
  enrolled: number;
  attendanceRate: number;           // %
  completionRate: number;           // %
  assessmentCompletionRate: number; // %
  certifiedCount: number;
  verifiedSkillOutcomes: number;
  placedCount: number;
  capacityUtilizationPct: number;
  status: CapacityUtilizationStatus;
  rootCauseFactors: string[];
  confidence: number;
  isDemoData: boolean;
}

export interface TrainerCompetency {
  skillId: string;
  skillName: string;
  proficiency: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED" | "MASTER";
  yearsExperience: number;
  isCertified: boolean;
  certificationDate?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  instituteId: string;
  instituteName: string;
  district: string;
  state: string;
  competencies: TrainerCompetency[];
  assignedCourses: string[];
  weeklyCapacityHours: number;
  isAvailableForRetraining: boolean;
  status: "ACTIVE" | "ON_LEAVE" | "TRAINING_ASSIGNED";
}

export interface TrainerGapMetric {
  skillId: string;
  skillName: string;
  district: string;
  state: string;
  requiredTrainers: number;
  availableTrainers: number;
  netGap: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  retrainingRecommendation: string;
  affectedCoursesCount: number;
  confidence: number;
}

export type EquipmentMaintenanceStatus =
  | "OPERATIONAL"
  | "MAINTENANCE_DUE"
  | "OUT_OF_ORDER"
  | "UNDER_REPAIR";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  instituteId: string;
  instituteName: string;
  courseId: string;
  district: string;
  state: string;
  totalQuantity: number;
  operationalQuantity: number;
  utilizationRate: number;          // %
  maintenanceStatus: EquipmentMaintenanceStatus;
  ageYears: number;
  associatedSkills: string[];
}

export interface EquipmentGapMetric {
  courseId: string;
  courseTitle: string;
  category: string;
  requiredUnits: number;
  operationalUnits: number;
  studentDemand: number;
  netGap: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  maintenanceRisk: "LOW" | "ELEVATED" | "SEVERE";
  estimatedCapacityImpact: number;  // % reduction in student lab hours
  affectedSeats: number;
  affectedLearners: number;
  confidence: number;
}

export type CurriculumSkillStatus =
  | "MET"
  | "PARTIAL"
  | "MISSING"
  | "OUTDATED"
  | "EMERGING";

export type CurriculumFreshness =
  | "FRESH"
  | "CURRENT"
  | "AGING"
  | "OUTDATED"
  | "INSUFFICIENT_DATA";

export interface CurriculumModule {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  targetProficiency: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED" | "MASTER" | "EXPERT" | string;
  theoryHours: number;
  practicalLabHours: number;
  status: CurriculumSkillStatus;
}

export interface CurriculumHealthDetail {
  courseId: string;
  courseTitle: string;
  modules: CurriculumModule[];
  curriculumGapScore: number;        // 0 - 100 (100 = full alignment)
  freshnessStatus: CurriculumFreshness;
  lastRevisedDate: string;
  missingMarketSkills: Array<{ skillId: string; skillName: string; marketDemand: number }>;
  outdatedSkills: Array<{ skillId: string; skillName: string; replacementTech: string }>;
  emergingSkillsToIntegrate: Array<{ skillId: string; skillName: string; emergingScore: number }>;
  recommendedAction: string;
  confidence: number;
}

export type HiringHorizon =
  | "IMMEDIATE_3M"
  | "NEAR_TERM_6M"
  | "ANNUAL_12M";

export interface EmployerDemandSignal {
  id: string;
  employerId: string;
  employerName: string;
  industryId: string;
  district: string;
  state: string;
  targetSkills: Array<{ skillId: string; skillName: string; proficiency: string }>;
  rolesNeeded: string[];
  hiringVolume: number;
  hiringHorizon: HiringHorizon;
  technologyAdoptionNotes: string;
  graduateReadinessRating: number;   // 1 - 5 stars
  period: string;
  confidence: number;
  isDemoData: boolean;
  createdAt: string;
}

export interface LabourMarketEvidence {
  id: string;
  source: string;
  sourceType:
    | "EMPLOYER_SURVEY"
    | "INDUSTRY_COUNCIL"
    | "GOVERNMENT_CENSUS"
    | "DISTRICT_EMPLOYMENT_EXCHANGE"
    | "APPRENTICESHIP_REGISTRY"
    | "FIELD_SURVEY"
    | "JOB_STREAM";
  geography: { stateCode: string; districtId?: string };
  industryId?: string;
  roleId?: string;
  skillId: string;
  period: string;
  reportedVolume: number;
  methodology: string;
  confidence: number;
  provenance: string;
  isDemoData: boolean;
}

export interface FusedMarketSignal {
  skillId: string;
  skillName: string;
  overallDemandVolume: number;
  contributingSourcesCount: number;
  hasConflict: boolean;
  conflictDescription?: string;
  sourceBreakdown: Array<{ sourceName: string; reportedVolume: number; weight: number }>;
  fusedConfidence: number;
  period: string;
}

export interface TrainingAccessGap {
  districtId: string;
  districtName: string;
  stateCode: string;
  demandedSkillId: string;
  demandedSkillName: string;
  localEmployerDemand: number;
  localTrainingCapacity: number;
  nearestTrainingCenterKm: number;
  accessSeverity: "CRITICAL_DESERT" | "MODERATE_GAP" | "ADEQUATE_ACCESS";
  deliveryModeRecommendation: "MOBILE_TRAINING_UNIT" | "NEW_ITI_COE_WING" | "SATELLITE_LAB_EXTENSION" | "DIGITAL_BLENDED";
  confidence: number;
}

export interface DistrictActionRecommendation {
  id: string;
  districtId: string;
  districtName: string;
  actionType:
    | "REVISE_CURRICULUM"
    | "EXPAND_SEATS"
    | "REDUCE_INTAKE"
    | "RETRAIN_TRAINERS"
    | "ACQUIRE_EQUIPMENT"
    | "IMPROVE_LAB_UTILIZATION"
    | "INTRODUCE_NEW_COURSE"
    | "ADD_EMERGING_MODULE"
    | "PARTNER_WITH_INDUSTRY"
    | "INVESTIGATE_LOW_PLACEMENT"
    | "IMPROVE_RURAL_ACCESS";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  expectedImpact: string;
  affectedPopulation: number;
  affectedSkills: string[];
  affectedCourses: string[];
  confidence: number;
  evidence: string[];
  estimatedImplementationComplexity: "LOW" | "MEDIUM" | "HIGH";
}

export interface DistrictSkillAndTrainingProfile {
  districtId: string;
  districtName: string;
  stateCode: string;
  period: string;
  summaryMetrics: {
    totalDemand: number;
    availableSupply: number;
    trainingCapacitySeats: number;
    overallNetGap: number;
    averagePlacementRate: number;
    trainerShortageCount: number;
    equipmentShortageCount: number;
  };
  prioritySkills: Array<{ skillId: string; skillName: string; demand: number; netGap: number; tightness: string }>;
  courseHealthBreakdown: { healthy: number; watch: number; atRisk: number };
  recommendations: DistrictActionRecommendation[];
  confidence: number;
}

export type InterventionStatus =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface InterventionRecord {
  id: string;
  title: string;
  type: string;
  scope: "DISTRICT" | "STATE" | "INSTITUTE" | "NATIONAL";
  targetSkillId?: string;
  targetCourseId?: string;
  targetDistrictId?: string;
  targetInstituteId?: string;
  reason: string;
  evidence: string[];
  expectedOutcome: string;
  baselineValue: number;
  targetValue: number;
  actualValue?: number;
  ownerName: string;
  timelineMonths: number;
  status: InterventionStatus;
  createdBy: string;
  approvedBy?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
  isDemoData?: boolean;
}

export interface InterventionOutcomeEvaluation {
  interventionId: string;
  title: string;
  status: InterventionStatus;
  baselineValue: number;
  targetValue: number;
  actualValue: number;
  achievementPercentage: number;
  associatedImprovementSummary: string;
  isCausalEstablished: false;
  recordedAt: string;
}

export interface ScenarioSimulationRequest {
  scenarioType:
    | "SEAT_CAPACITY_CHANGE"
    | "DEMAND_GROWTH_SHIFT"
    | "TECHNOLOGY_DISRUPTION"
    | "TRAINER_CAPACITY_SHIFT"
    | "EQUIPMENT_UPGRADE";
  targetSkillId?: string;
  targetCourseId?: string;
  targetDistrictId?: string;
  changePercentage: number;          // e.g. +20, -15
  timeHorizonQuarters?: number;
}

export interface ScenarioSimulationResult {
  label: "SIMULATION";
  scenarioType: string;
  inputParameters: Record<string, any>;
  baselineMetrics: { demand: number; supply: number; netGap: number; capacity: number };
  projectedMetrics: { demand: number; supply: number; netGap: number; capacity: number };
  projectedSupplyDelta: number;
  projectedGapDelta: number;
  projectedCapacityImpact: string;
  confidence: number;
  caveats: string[];
}

export interface StrategicSkillClassification {
  skillId: string;
  skillName: string;
  priorityScore: number;             // 0 - 100
  classifications: Array<
    | "CRITICAL_SHORTAGE"
    | "HIGH_PRIORITY"
    | "EMERGING"
    | "STABLE"
    | "OVERSUPPLIED"
    | "DECLINING"
    | "STRATEGIC"
    | "INSUFFICIENT_DATA"
  >;
  explanation: string;
  confidence: number;
}

export interface IntelligenceRuleVersion {
  ruleId: string;
  ruleName: string;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  parameters: Record<string, any>;
  createdBy: string;
  reason: string;
  status: "ACTIVE" | "DEPRECATED" | "SUPERSEDED";
}
