// ==============================================================================
// CAREERIS CANDIDATE CAREER OPERATING SYSTEM DOMAIN TYPES
// Master Prompt 13: Personal Career Intelligence, Copilot, Resume & Simulator
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Next Best Actions Engine
// ------------------------------------------------------------------------------

export type ActionCategory =
  | "COMPLETE_PROFILE"
  | "VERIFY_SKILL"
  | "TAKE_ASSESSMENT"
  | "LEARN_SKILL"
  | "BUILD_PROJECT"
  | "EARN_CREDENTIAL"
  | "APPLY_JOB"
  | "IMPROVE_RESUME"
  | "PREPARE_INTERVIEW";

export interface NextBestAction {
  actionId: string;
  category: ActionCategory;
  title: string;
  description: string;
  priorityScore: number;    // 0 - 100
  urgencyLevel: "HIGH" | "MEDIUM" | "LOW";
  effortEstimate: string;   // e.g. "20 mins", "2 hours", "1 week"
  marketImpactScore: number;// 0 - 100
  targetEntityId?: string;
  targetEntityTitle?: string;
  linkUrl: string;
  isCompleted: boolean;
}

// ------------------------------------------------------------------------------
// 2. Career Comparison & Multi-Path Simulator
// ------------------------------------------------------------------------------

export interface CareerComparisonRoleDetail {
  roleId: string;
  roleTitle: string;
  industryName: string;
  overallMatchScore: number;
  matchingSkillsCount: number;
  totalRequiredSkillsCount: number;
  matchingSkills: string[];
  missingSkills: string[];
  estimatedLearningMonths: number;
  marketDemandIndex: number; // 0 - 100
  salaryRangeINR: { min: number; max: number };
  trainingInstitutesCount: number;
  careerProgressionOpportunity: string;
}

export interface CareerComparisonResult {
  comparisonId: string;
  roles: CareerComparisonRoleDetail[];
  summaryRecommendation: string;
}

export interface CareerSimulationStep {
  phaseNumber: number;
  phaseName: string;
  stepType: "FOUNDATION" | "CORE_SKILL" | "ADVANCED_SKILL" | "PROJECT" | "ASSESSMENT" | "VERIFIED_CREDENTIAL" | "JOB_APPLICATION";
  title: string;
  description: string;
  associatedSkillId?: string;
  associatedSkillName?: string;
  estimatedWeeks: number;
  isAlreadyMet: boolean;
  actionUrl: string;
}

export interface CareerSimulationPlan {
  simulationId: string;
  candidateId: string;
  currentRoleTitle: string;
  targetRoleId: string;
  targetRoleTitle: string;
  targetIndustryName: string;
  currentReadinessScore: number;
  projectedReadinessScore: number;
  totalEstimatedMonths: number;
  steps: CareerSimulationStep[];
  transferableSkills: string[];
  criticalGapsToBridge: string[];
  confidenceScore: number;
  disclaimer: string;
}

// ------------------------------------------------------------------------------
// 3. Resume Intelligence & ATS Optimizer
// ------------------------------------------------------------------------------

export interface ResumeExtractedData {
  candidateName: string;
  contactEmail: string;
  extractedSkills: string[];
  extractedRoles: string[];
  totalExperienceYears: number;
  extractedProjects: Array<{ title: string; description: string; skills: string[] }>;
  educationSummary: string;
}

export interface ResumeJobOptimizationResult {
  targetJobId: string;
  targetJobTitle: string;
  companyName: string;
  overallMatchPercentage: number;
  matchedSkills: string[];
  missingKeySkills: string[];
  weakEvidenceSkills: string[];
  missingKeywords: string[];
  experienceGapSummary?: string;
  actionableRecommendations: string[];
}

// ------------------------------------------------------------------------------
// 4. Interview Preparation & Mock Sessions
// ------------------------------------------------------------------------------

export interface InterviewQuestion {
  questionId: string;
  category: "TECHNICAL" | "BEHAVIORAL" | "SKILL_SCENARIO" | "INDUSTRY_KNOWLEDGE";
  questionText: string;
  sampleGoodAnswer: string;
  relevantSkills: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface MockInterviewEvaluation {
  questionId: string;
  candidateAnswerText: string;
  score: number; // 0 - 100
  strengths: string[];
  areasForImprovement: string[];
  aiFeedback: string;
}

export interface InterviewPrepSession {
  sessionId: string;
  targetJobId: string;
  targetJobTitle: string;
  companyName: string;
  questions: InterviewQuestion[];
  evaluations: MockInterviewEvaluation[];
  practiceDate: string;
  disclaimer: string;
}

// ------------------------------------------------------------------------------
// 5. Job Rejection Intelligence
// ------------------------------------------------------------------------------

export interface JobRejectionInsight {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: "REJECTED" | "NOT_SELECTED" | "POOL_EXPIRED";
  mismatchFactors: {
    skillGapFactor: string;
    experienceAlignmentFactor: string;
    assessmentPerformanceFactor?: string;
    applicantPoolCompetition: string;
  };
  recommendedNextActions: string[];
  disclaimer: string;
}

// ------------------------------------------------------------------------------
// 6. Longitudinal Career Journey Timeline
// ------------------------------------------------------------------------------

export type CareerTimelineStage =
  | "PROFILE_CREATION"
  | "SKILL_ACQUISITION"
  | "ASSESSMENT_COMPLETION"
  | "CREDENTIAL_EARNED"
  | "JOB_APPLICATION"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_RECEIVED"
  | "PLACEMENT_CONFIRMED"
  | "RETENTION_MILESTONE";

export interface CareerJourneyMilestone {
  milestoneId: string;
  stage: CareerTimelineStage;
  title: string;
  description: string;
  timestamp: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PLANNED";
  evidenceUri?: string;
  metadata?: Record<string, any>;
}

// ------------------------------------------------------------------------------
// 7. Grounded Career Copilot Interface
// ------------------------------------------------------------------------------

export interface GroundedCareerCopilotResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  relevantSkills: string[];
  missingSkills: string[];
  marketDemandSignal: string;
  confidenceScore: number;
  limitations: string;
  nextBestActions: NextBestAction[];
}
