// ==============================================================================
// CAREERIS TRAINING ECOSYSTEM & LEARNING INTELLIGENCE DOMAIN TYPE SYSTEM
// Master Prompt 15: Course Marketplace, Curriculum Intelligence, Assessments & Training OS
// ==============================================================================

import { ProficiencyLevel, UserRole } from "@/types";

export type TrainingProviderCategory =
  | "ITI"
  | "GOVERNMENT_TP"
  | "PRIVATE_TP"
  | "SKILL_CENTRE"
  | "POLYTECHNIC"
  | "COLLEGE_UNIVERSITY"
  | "INDUSTRY_TRAINING_CENTRE"
  | "EMPLOYER_ACADEMY"
  | "APPRENTICESHIP_PROVIDER"
  | "ONLINE_HYBRID_PROVIDER"
  | "INDUSTRY_COUNCIL";

export type CourseDeliveryMode = "CLASSROOM" | "PRACTICAL_LAB" | "BLENDED" | "APPRENTICESHIP_DUAL" | "ONLINE";

// ------------------------------------------------------------------------------
// 1. Course & Curriculum Structure
// ------------------------------------------------------------------------------

export interface CurriculumModuleDetail {
  moduleId: string;
  moduleNumber: number;
  title: string;
  durationHours: number;
  description: string;
  coveredSkills: Array<{
    skillId: string;
    skillName: string;
    expectedProficiency: ProficiencyLevel;
  }>;
  learningOutcomes: string[];
  assessmentMethods: string[];
}

export interface CurriculumVersionRecord {
  versionId: string;
  courseId: string;
  versionNumber: string; // e.g. "v2.1"
  publishedAt: string;
  status: "ACTIVE" | "SUPERSEDED" | "DRAFT";
  changeSummary: string;
  modules: CurriculumModuleDetail[];
  marketAlignmentScore: number; // 0 - 100
  marketAlignmentStatus: "ALIGNED" | "PARTIALLY_ALIGNED" | "OUTDATED" | "MISSING_SKILLS";
  missingMarketSkills: string[];
}

export interface CourseDetailRecord {
  courseId: string;
  courseCode: string;
  title: string;
  providerId: string;
  providerName: string;
  providerType: TrainingProviderCategory;
  district: string;
  state: string;
  durationWeeks: number;
  deliveryMode: CourseDeliveryMode;
  eligibility: string;
  prerequisites: string[];
  skillsTaught: Array<{
    skillId: string;
    skillName: string;
    proficiencyGain: ProficiencyLevel;
    isCore: boolean;
  }>;
  targetRoleIds: string[];
  targetRoleTitles: string[];
  courseHealthScore: number; // 0 - 100
  courseHealthClassification: "EXCELLENT" | "GOOD" | "WATCH" | "AT_RISK" | "CRITICAL";
  activeCurriculumVersion: string;
  totalSeats: number;
  availableSeats: number;
  placementRatePercentage: number;
  isGreenSkillCourse: boolean;
  tuitionFeeINR: number;
  credentialAwarded: string;
  lastAuditedAt: string;
}

// ------------------------------------------------------------------------------
// 2. Batch Management & Learner Enrollments
// ------------------------------------------------------------------------------

export interface BatchRecord {
  batchId: string;
  courseId: string;
  batchName: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  enrolledCount: number;
  assignedTrainerName: string;
  assignedLabName: string;
  status: "PLANNED" | "OPEN" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface LearnerEnrollmentRecord {
  enrollmentId: string;
  candidateId: string;
  candidateName: string;
  courseId: string;
  courseTitle: string;
  batchId: string;
  status: "APPLICATION" | "ELIGIBILITY_CHECK" | "ACCEPTED" | "ENROLLED" | "ACTIVE" | "COMPLETED" | "WITHDRAWN";
  progressPercentage: number;
  skillsAcquired: string[];
  enrolledAt: string;
  completedAt?: string;
}

// ------------------------------------------------------------------------------
// 3. Assessment Question Bank & Attempts
// ------------------------------------------------------------------------------

export interface AssessmentQuestionItem {
  questionId: string;
  skillId: string;
  skillName: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  questionType: "MCQ" | "SCENARIO" | "PRACTICAL_DEMO";
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  scoringRubric?: string;
}

export interface AssessmentAttemptRecord {
  attemptId: string;
  assessmentId: string;
  assessmentTitle: string;
  candidateId: string;
  candidateName: string;
  startedAt: string;
  submittedAt: string;
  scorePercentage: number;
  status: "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "VERIFIED" | "INVALIDATED";
  skillLevelBreakdown: Array<{
    skillName: string;
    score: number;
    isVerified: boolean;
  }>;
}

// ------------------------------------------------------------------------------
// 4. Training Demand Request & Provider Marketplace
// ------------------------------------------------------------------------------

export interface TrainingDemandRequestRecord {
  requestId: string;
  employerId: string;
  employerName: string;
  roleTargetTitle: string;
  headcountNeeded: number;
  requiredSkills: string[];
  targetDistrict: string;
  timelineWeeks: number;
  status: "OPEN" | "RESPONDED" | "SHORTLISTED" | "SELECTED" | "CLOSED";
  createdAt: string;
  responses: Array<{
    responseId: string;
    providerId: string;
    providerName: string;
    offeredCapacity: number;
    courseTitle: string;
    durationWeeks: number;
    quotePerTraineeINR: number;
    trainerReadinessScore: number;
    equipmentReadinessScore: number;
  }>;
}

// ------------------------------------------------------------------------------
// 5. Grounded AI Learning Advisor
// ------------------------------------------------------------------------------

export interface GroundedLearningAdvisorResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  recommendedCourses: Array<{
    courseId: string;
    title: string;
    providerName: string;
    matchReason: string;
    feeINR: number;
  }>;
  prerequisitesNeeded: string[];
  confidenceScore: number;
  limitations: string;
}
