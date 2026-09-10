// ==============================================================================
// CAREERIS EMPLOYER RECRUITMENT OPERATING SYSTEM TYPE SYSTEM
// Master Prompt 18: Skill-Based Recruitment, Talent Discovery, ATS & Hire-vs-Train
// ==============================================================================

import { ProficiencyLevel } from "@/types";

export type SkillImportancePriority = "MUST_HAVE" | "IMPORTANT" | "PREFERRED";

export interface RequisitionSkillRequirement {
  skillId: string;
  skillName: string;
  minProficiency: ProficiencyLevel;
  importance: SkillImportancePriority;
  weight: number; // 0 - 100
}

export interface SkillFirstJobRequisition {
  requisitionId: string;
  employerId: string;
  employerName: string;
  title: string;
  roleId: string;
  roleTitle: string;
  industry: string;
  district: string;
  state: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "APPRENTICESHIP" | "CONTRACT";
  workMode: "ON_SITE" | "HYBRID" | "REMOTE";
  experienceYearsRange: { min: number; max: number };
  salaryRangeINR: { min: number; max: number };
  skills: RequisitionSkillRequirement[];
  healthScore: number; // 0 - 100
  talentAvailabilityEstimate: {
    estimatedPoolCount: number;
    verifiedTalentCount: number;
    hiringDifficulty: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    averageTimeToHireDays: number;
  };
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  createdAt: string;
}

export interface CandidateMatchResultItem {
  candidateId: string;
  candidateName: string;
  matchScore: number; // 0 - 100
  classification: "STRONG_MATCH" | "GOOD_MATCH" | "TRAINABLE" | "STRETCH" | "LOW_MATCH";
  matchedSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  trainabilityIndex: number; // 0 - 100
  evidenceStrength: number;  // 0 - 100
  hasVerifiedPassport: boolean;
  district: string;
  state: string;
  candidateVisibility: "PUBLIC" | "ANONYMOUS" | "RESTRICTED";
}

export interface RecruitmentPipelineRecord {
  applicationId: string;
  requisitionId: string;
  candidateId: string;
  candidateName: string;
  currentStage: "APPLIED" | "VIEWED" | "SHORTLISTED" | "ASSESSMENT_REQUESTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "HIRED";
  recruiterNotes: string[];
  interviewScorecard?: {
    technicalScore: number;
    problemSolvingScore: number;
    verdict: "RECOMMEND_HIRE" | "MAYBE" | "REJECT";
  };
  offerDetails?: {
    salaryOfferedINR: number;
    status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED";
  };
  updatedAt: string;
}

export interface WorkforceHireVsTrainModel {
  roleTarget: string;
  headcountNeeded: number;
  hireStrategyCostINR: number;
  reskillStrategyCostINR: number;
  hireTimeToProductivityWeeks: number;
  reskillTimeToProductivityWeeks: number;
  recommendationVerdict: "HIRE" | "TRAIN" | "HIRE_AND_TRAIN";
  costSavingsPercentage: number;
  riskAssessment: "LOW" | "MODERATE" | "HIGH";
  trainingPartnerMatch: {
    providerId: string;
    providerName: string;
    courseTitle: string;
    durationWeeks: number;
    estimatedCostINR: number;
  };
}

export interface GroundedRecruiterCopilotResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  candidateRecommendations: Array<{
    candidateId: string;
    candidateName: string;
    matchScore: number;
    matchReason: string;
  }>;
  hiringDifficultyAnalysis: string;
  recommendedSourcingAction: string;
  confidenceScore: number;
  limitations: string;
}
