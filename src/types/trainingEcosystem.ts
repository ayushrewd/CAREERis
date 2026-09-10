// ==============================================================================
// CAREERIS TRAINING ECOSYSTEM INTELLIGENCE DOMAIN TYPE SYSTEM
// ITI Operating System, Course Health, Trainer Capacity, Labs & Training-to-Employment
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Institute Profiles & 10-Dimension Health Scorecard
// ------------------------------------------------------------------------------

export type TrainingInstituteType =
  | "ITI"
  | "POLYTECHNIC"
  | "SKILL_CENTRE"
  | "VOCATIONAL_INSTITUTE"
  | "TRAINING_PROVIDER"
  | "INDUSTRY_TRAINING_CENTRE";

export interface InstituteHealthComponentScores {
  marketRelevance: number;       // 0 - 100
  seatUtilization: number;       // 0 - 100
  completionRate: number;        // 0 - 100
  assessmentPerformance: number; // 0 - 100
  placementPerformance: number;  // 0 - 100
  trainerAdequacy: number;       // 0 - 100
  equipmentReadiness: number;    // 0 - 100
  curriculumFreshness: number;   // 0 - 100
  employerEngagement: number;    // 0 - 100
  dataQuality: number;           // 0 - 100
}

export interface TrainingInstituteProfile {
  id: string;
  code: string;
  name: string;
  type: TrainingInstituteType;
  affiliation: "NCVT" | "SCVT" | "AICTE" | "NSDC_PARTNER" | "CORPORATE_COE";
  address: string;
  districtId: string;
  districtName: string;
  stateCode: string;
  stateName: string;
  clusterName?: string;
  contactEmail: string;
  contactPhone: string;
  principalName: string;
  totalSanctionedSeats: number;
  totalEnrolledStudents: number;
  totalActiveTrainers: number;
  totalLabsCount: number;
  overallHealthScore: number;     // 0 - 100
  healthClassification: "EXCELLENT" | "HEALTHY" | "WATCH" | "AT_RISK" | "CRITICAL";
  componentScores: InstituteHealthComponentScores;
  activeCoursesCount: number;
  employerPartnershipsCount: number;
  averagePlacementRatePercentage: number;
  confidenceScore: number;
  lastAuditedAt: string;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// 2. Course Health, Obsolescence & Oversupply Classification
// ------------------------------------------------------------------------------

export type CourseHealthCategory =
  | "EXCELLENT"
  | "HEALTHY"
  | "WATCH"
  | "AT_RISK"
  | "CRITICAL"
  | "OBSOLETE_CANDIDATE";

export type CourseRecommendationAction =
  | "START_COURSE"
  | "EXPAND"
  | "MAINTAIN"
  | "MODERNIZE"
  | "REDUCE"
  | "MERGE"
  | "REVIEW"
  | "RETIRE";

export interface CourseHealthDetail {
  courseId: string;
  courseTitle: string;
  courseCode: string;
  instituteId: string;
  instituteName: string;
  districtName: string;
  stateCode: string;
  classification: CourseHealthCategory;
  healthScore: number; // 0 - 100
  components: {
    marketDemand: number;
    skillRelevance: number;
    placementOutcome: number;
    curriculumFreshness: number;
    employerValidation: number;
    trainingCapacity: number;
    assessmentPerformance: number;
  };
  obsolescenceRisk: {
    level: "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL_RISK";
    signals: string[];
    isCandidateForRetirement: boolean;
  };
  oversupplyStatus: {
    classification: "BALANCED" | "MILD_OVERSUPPLY" | "HIGH_OVERSUPPLY" | "CRITICAL_OVERSUPPLY";
    sanctionedSeats: number;
    localDemand: number;
    utilizationRate: number;
    recommendationText: string;
  };
  recommendedAction: CourseRecommendationAction;
  actionRationale: string;
  confidence: number;
}

// ------------------------------------------------------------------------------
// 3. Curriculum Intelligence, Modules & Versioning
// ------------------------------------------------------------------------------

export type CurriculumVersionStatus = "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "DEPRECATED";

export interface CurriculumModule {
  moduleId: string;
  courseId: string;
  moduleName: string;
  description: string;
  durationHours: number;
  mappedSkillIds: string[];
  mappedSkillNames: string[];
  learningOutcomes: string[];
  assessmentMethodology: string;
  technologyStack: string[];
  version: string;
  status: CurriculumVersionStatus;
  lastUpdated: string;
  marketRelevanceScore: number; // 0 - 100
}

export interface CurriculumGapEvaluation {
  courseId: string;
  courseTitle: string;
  freshnessStatus: "FRESH" | "AGING" | "STALE" | "CRITICAL_UPDATE_REQUIRED";
  gapScore: number; // 0 - 100 (0 = complete gap, 100 = full alignment)
  coveredSkills: Array<{ skillId: string; skillName: string; coverageStatus: "COVERED" | "PARTIAL" }>;
  missingEmployerDemandedSkills: Array<{ skillId: string; skillName: string; marketDemandVolume: number }>;
  outdatedModulesCount: number;
  recommendedModifications: string[];
  employerFeedbackSignals: Array<{
    employerName: string;
    feedbackDate: string;
    missingSkillsNoted: string[];
    technologyGaps: string;
    conflictingSignalDetected: boolean;
  }>;
  confidence: number;
}

// ------------------------------------------------------------------------------
// 4. Trainer Intelligence, Workload & Retraining Pathways
// ------------------------------------------------------------------------------

export type TrainerQualificationStatus = "QUALIFIED" | "PARTIALLY_QUALIFIED" | "UNQUALIFIED";
export type TrainerWorkloadStatus = "UNDERUTILIZED" | "OPTIMAL" | "HIGH_LOAD" | "OVERLOADED";

export interface TrainerCompetency {
  skillId: string;
  skillName: string;
  proficiencyLevel: string;
  certifiedBy: string;
  verifiedDate: string;
}

export interface TrainerRecord {
  id: string;
  trainerName: string;
  instituteId: string;
  instituteName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  industryExperienceYears: number;
  assignedCourseIds: string[];
  assignedCourseNames: string[];
  competencies: TrainerCompetency[];
  qualificationStatus: TrainerQualificationStatus;
  workloadStatus: TrainerWorkloadStatus;
  activeBatchesCount: number;
  totalStudentsAssigned: number;
  weeklyTeachingHours: number;
  needsRetraining: boolean;
  retrainingPathway?: {
    targetSkillId: string;
    targetSkillName: string;
    targetModule: string;
    recommendedProgram: string;
    durationWeeks: number;
    assessmentCertification: string;
  };
}

// ------------------------------------------------------------------------------
// 5. Lab & Equipment Intelligence & Failure Simulation
// ------------------------------------------------------------------------------

export type EquipmentReadinessStatus = "READY" | "PARTIAL" | "AT_RISK" | "CRITICAL";

export interface LabDetail {
  labId: string;
  labName: string;
  instituteId: string;
  instituteName: string;
  capacityWorkstations: number;
  operationalStatus: "FULLY_OPERATIONAL" | "PARTIAL_MAINTENANCE" | "DEGRADED" | "CRITICAL_SHUTDOWN";
  utilizationStatus: "UNDERUTILIZED" | "OPTIMAL" | "OVERLOADED";
  utilizationRatePercentage: number;
  supportedSkills: string[];
  supportedCourses: string[];
  equipmentItemsCount: number;
  lastInspectedAt: string;
}

export interface EquipmentDetail {
  id: string;
  labId: string;
  labName: string;
  instituteId: string;
  equipmentName: string;
  category: string;
  totalQuantity: number;
  operationalQuantity: number;
  maintenanceStatus: "OPERATIONAL" | "NEEDS_SERVICE" | "OUT_OF_ORDER" | "REPLACEMENT_REQUIRED";
  readinessStatus: EquipmentReadinessStatus;
  ageYears: number;
  supportedSkills: string[];
  supportedCourses: string[];
}

export interface EquipmentFailureSimulationResult {
  label: "SIMULATION";
  disclaimer: "THIS IS AN EQUIPMENT FAILURE IMPACT SIMULATION FOR PREVENTIVE MAINTENANCE GOVERNANCE.";
  equipmentId: string;
  equipmentName: string;
  labName: string;
  affectedCourses: string[];
  affectedSeats: number;
  affectedStudentsCount: number;
  affectedSkills: string[];
  potentialPlacementImpactPercentage: number;
  estimatedRepairCostINR: number;
  recommendedPreventiveAction: string;
  generatedAt: string;
}

// ------------------------------------------------------------------------------
// 6. Training-to-Employment Funnel & Market Fit Score
// ------------------------------------------------------------------------------

export interface TrainingFunnelStage {
  stageName:
    | "INTERESTED"
    | "ENROLLED"
    | "LEARNING"
    | "COMPLETED"
    | "ASSESSED"
    | "CERTIFIED"
    | "VERIFIED"
    | "AVAILABLE"
    | "PLACED";
  volume: number;
  conversionRatePercentage: number;
  dropOffCount: number;
  dropOffRatePercentage: number;
  primaryLeakageReason?: string;
}

export interface CourseMarketFitScore {
  courseId: string;
  courseTitle: string;
  overallFitScore: number; // 0 - 100
  marketFitGrade: "HIGH_FIT" | "MODERATE_FIT" | "POOR_FIT";
  dimensions: {
    demandVolume: number;
    skillAlignment: number;
    placementSuccess: number;
    employerSatisfaction: number;
    emergingSkillAdoption: number;
    curriculumFreshness: number;
  };
  portfolioClassification: "EXPAND" | "MODERNIZE" | "MAINTAIN" | "CONSOLIDATE" | "REVIEW" | "RETIRE";
  actionRecommendation: string;
}

// ------------------------------------------------------------------------------
// 7. Grounded AI Training Copilot
// ------------------------------------------------------------------------------

export interface AITrainingCopilotQuery {
  userRole: UserRole;
  instituteId?: string;
  courseId?: string;
  districtId?: string;
  query: string;
}

export interface AITrainingCopilotResponse {
  answer: string;
  groundingLabel: "FACT" | "ANALYSIS" | "RECOMMENDATION" | "FORECAST" | "SIMULATION" | "DATA_LIMITATION";
  groundingData: {
    institutesReferenced?: string[];
    coursesReferenced?: string[];
    skillsReferenced?: string[];
    trainersReferenced?: string[];
    labsReferenced?: string[];
    sourcesUsed: string[];
  };
  suggestedFollowUpActions?: Array<{ title: string; actionUrl: string }>;
  actionOptions?: string[];
}

export interface ITrainingAIProvider {
  askCopilot(query: AITrainingCopilotQuery): Promise<AITrainingCopilotResponse>;
}
