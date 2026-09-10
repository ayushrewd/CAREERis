// ==============================================================================
// CAREERIS CANDIDATE GUIDANCE & CAREER OPERATING SYSTEM TYPE SYSTEM
// Master Prompt 17: National Career Guidance, Transitions, Employability & Copilot
// ==============================================================================

import { ProficiencyLevel } from "@/types";

export interface PersonalizedCareerDiscoveryRecord {
  roleId: string;
  roleTitle: string;
  industryName: string;
  fitClassification: "BEST_FIT" | "ADJACENT_CAREER" | "TRANSITION" | "STRETCH";
  fitScore: number; // 0 - 100
  matchingSkills: string[];
  missingSkills: string[];
  annualDemandVolume: number;
  salaryRangeINR: { min: number; max: number };
  transitionEaseScore: number; // 0 - 100
  whyItFitsExplanation: string;
  identifiedRisks: string[];
}

export interface CareerTransitionModel {
  transitionId: string;
  fromRoleTitle: string;
  toRoleTitle: string;
  skillTransferabilityPercentage: number; // 0 - 100
  sharedSkills: string[];
  gapSkills: Array<{
    skillName: string;
    importance: "CRITICAL" | "HIGH" | "MEDIUM";
  }>;
  estimatedLearningWeeks: number;
  prerequisiteCourses: string[];
  marketDemandGrowthPercentage: number;
}

export interface NextBestActionItem {
  actionId: string;
  title: string;
  description: string;
  category: "LEARNING" | "ASSESSMENT" | "PROJECT" | "JOB_APPLICATION" | "PROFILE_UPDATE";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedMinutes: number;
  targetSkillOrRole?: string;
  isCompleted: boolean;
}

export interface CandidateEmployabilityScorecard {
  candidateId: string;
  overallReadinessScore: number; // 0 - 100
  readinessLevel: "HIGHLY_READY" | "MODERATELY_READY" | "DEVELOPING" | "EARLY_STAGE";
  components: {
    skillCoverage: number;
    evidenceStrength: number;
    assessmentVerifiedRatio: number;
    profileCompleteness: number;
    marketDemandAlignment: number;
  };
  keyStrengths: string[];
  primaryGaps: string[];
  nextBestActions: NextBestActionItem[];
  lastCalculatedAt: string;
}

export interface InterviewPracticeQuestion {
  questionId: string;
  roleTarget: string;
  questionType: "TECHNICAL" | "BEHAVIORAL" | "SITUATIONAL";
  questionText: string;
  expectedSkills: string[];
  sampleAnswerOutline: string;
  scoringRubric: string;
}

export interface GroundedCandidateCopilotResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  recommendedNextActions: NextBestActionItem[];
  confidenceScore: number;
  limitations: string;
}
