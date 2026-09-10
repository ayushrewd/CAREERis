// ==============================================================================
// CAREERIS CAREER JOURNEY & EMPLOYMENT EXECUTION TYPE SYSTEM
// Everything connects through Canonical Skills
// ==============================================================================

import { ProficiencyLevel, EvidenceVerificationStatus } from "@/types";

export interface CareerGoal {
  id: string;
  candidateId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  targetIndustryId: string;
  targetIndustryName: string;
  targetGeography: {
    stateCode: string;
    stateName?: string;
    districtId?: string;
    districtName?: string;
    clusterId?: string;
    clusterName?: string;
  };
  targetSalaryRangeINR: { min: number; max: number };
  targetTimelineMonths: number;
  priority: "PRIMARY" | "SECONDARY" | "ASPIRATIONAL";
  createdAt: string;
  updatedAt: string;
  isDemoData?: boolean;
}

export interface CandidateReadinessFactor {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: "MET" | "PARTIAL" | "MISSING";
  description: string;
}

export interface CandidateReadinessDetail {
  candidateId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  overallReadinessScore: number; // 0 - 100
  readinessLevel: "HIGHLY_READY" | "MODERATELY_READY" | "DEVELOPING" | "EARLY_STAGE";
  factors: {
    skillCoverage: CandidateReadinessFactor;
    skillProficiency: CandidateReadinessFactor;
    evidenceStrength: CandidateReadinessFactor;
    experienceAlignment: CandidateReadinessFactor;
    marketAlignment: CandidateReadinessFactor;
    roleAlignment: CandidateReadinessFactor;
  };
  gapItems: Array<{
    skillId: string;
    skillName: string;
    status: "MET" | "PARTIAL" | "MISSING";
    currentProficiency: string;
    requiredProficiency: string;
    importance: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    hasVerifiedEvidence: boolean;
  }>;
  explanation: string;
  confidence: number;
  isDemoData?: boolean;
}

export type CareerFitClassification =
  | "BEST_FIT"
  | "STRONG_FIT"
  | "ADJACENT_CAREER"
  | "CAREER_TRANSITION"
  | "EMERGING_OPPORTUNITY";

export interface CareerDiscoveryRecommendation {
  roleId: string;
  roleTitle: string;
  industryId: string;
  industryName: string;
  fitClassification: CareerFitClassification;
  fitScore: number; // 0 - 100
  matchingSkillsCount: number;
  totalRequiredSkillsCount: number;
  topMatchingSkills: string[];
  missingKeySkills: string[];
  annualDemandVolume: number;
  salaryRangeINR: { min: number; max: number };
  rationale: string;
  confidence: number;
}

export interface CareerTransitionAnalysis {
  fromRoleId?: string;
  fromRoleTitle: string;
  toRoleId: string;
  toRoleTitle: string;
  toIndustryName: string;
  transferableSkills: Array<{ skillId: string; skillName: string; proficiency: string }>;
  missingSkills: Array<{ skillId: string; skillName: string; importance: string }>;
  prerequisites: string[];
  estimatedTransitionMonths: number;
  projectedReadinessScore: number;
  recommendedCourses: Array<{ courseId: string; title: string; providerName: string; durationHours: number }>;
  recommendedProjects: Array<{ projectId: string; title: string; difficulty: string }>;
  relevantEmployers: Array<{ employerId: string; employerName: string; location: string; activeJobsCount: number }>;
  relevantGeography: Array<{ districtName: string; stateCode: string; demandVolume: number }>;
  confidence: number;
}

export interface PrioritizedSkillItem {
  skillId: string;
  skillName: string;
  categoryName: string;
  priorityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priorityRank: number;
  currentProficiency: string;
  targetProficiency: string;
  reasons: {
    roleImportance: string;
    annualMarketDemand: number;
    demandGrowthYoY: number;
    employerAdoptionRate: string;
    learningDifficulty: "EASY" | "MODERATE" | "CHALLENGING";
    expectedCareerImpact: string;
  };
  recommendedNextAction: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  targetRoleId: string;
  skillsAddressed: Array<{ skillId: string; skillName: string }>;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedEffortHours: number;
  toolsRequired: string[];
  expectedEvidenceArtifact: string;
  assessmentRelevance: string;
  isCompleted?: boolean;
  submittedEvidenceUrl?: string;
}

export interface PersonalizedJobOpportunity {
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  district: string;
  state: string;
  salaryRangeINR: { min: number; max: number };
  category:
    | "BEST_MATCH"
    | "NEARBY"
    | "REMOTE"
    | "HIGH_GROWTH"
    | "SKILL_GAP_OPPORTUNITIES"
    | "EMERGING_ROLES"
    | "ENTRY_LEVEL"
    | "EXPERIENCED";
  matchScore: number; // 0 - 100
  skillCoverageScore: number;
  proficiencyScore: number;
  evidenceScore: number;
  experienceAlignmentScore: number;
  matchedSkills: Array<{ skillId: string; skillName: string }>;
  missingSkills: Array<{ skillId: string; skillName: string; isMandatory: boolean }>;
  whyYouMatch: string;
  whatIsMissing: string;
  isApplied?: boolean;
}

export interface MatchSimulationResult {
  label: "SIMULATION";
  jobId: string;
  jobTitle: string;
  companyName: string;
  currentMatchScore: number;
  simulatedSkillAdded: { skillId: string; skillName: string; proficiency: string };
  projectedMatchScore: number;
  matchScoreDelta: number;
  reason: string;
  confidence: number;
  caveat: string;
}

export interface ApplicationPerformanceAnalytics {
  totalApplications: number;
  stagesCount: {
    applied: number;
    viewed: number;
    shortlisted: number;
    assessmentRequested: number;
    interviewScheduled: number;
    offered: number;
    hired: number;
  };
  conversionRates: {
    viewRatePct: number;
    shortlistRatePct: number;
    interviewRatePct: number;
    offerRatePct: number;
    hireRatePct: number;
  };
  possibleContributingFactors: Array<{
    area: "SKILL_GAP" | "EVIDENCE_GAP" | "EXPERIENCE_GAP" | "PROFILE_COMPLETENESS" | "LOCATION_FIT";
    status: "HEALTHY" | "ATTENTION_NEEDED";
    observation: string;
    suggestedAction: string;
  }>;
}

export interface ProfileCompletenessScore {
  overallPercentage: number; // 0 - 100
  sections: {
    basicInfo: { isComplete: boolean; weight: number };
    education: { isComplete: boolean; weight: number };
    skills: { isComplete: boolean; weight: number; count: number };
    evidence: { isComplete: boolean; weight: number; count: number };
    experience: { isComplete: boolean; weight: number };
    projects: { isComplete: boolean; weight: number; count: number };
    careerGoals: { isComplete: boolean; weight: number };
    preferences: { isComplete: boolean; weight: number };
  };
  missingActionItems: string[];
}

export interface CareerTimelineEvent {
  id: string;
  candidateId: string;
  eventType:
    | "EDUCATION_ENROLLED"
    | "COURSE_COMPLETED"
    | "CERTIFICATION_EARNED"
    | "PROJECT_SUBMITTED"
    | "ASSESSMENT_PASSED"
    | "SKILL_VERIFIED"
    | "JOB_APPLIED"
    | "INTERVIEW_SCHEDULED"
    | "OFFER_RECEIVED"
    | "EMPLOYMENT_STARTED"
    | "CAREER_MILESTONE";
  title: string;
  description: string;
  entityId?: string;
  eventDate: string;
  badgeUrl?: string;
  verifiedBy?: string;
}

export interface CareerProgressSummary {
  goalId: string;
  targetRoleTitle: string;
  startingReadinessScore: number;
  currentReadinessScore: number;
  skillsAddedCount: number;
  skillsVerifiedCount: number;
  coursesCompletedCount: number;
  projectsCompletedCount: number;
  applicationsCount: number;
  interviewsCount: number;
  offersCount: number;
  progressVelocityPct: number;
  readinessTimeline: Array<{ period: string; score: number }>;
}

export interface EmployabilityScoreIndicator {
  candidateId: string;
  score: number; // 0 - 100
  ratingTier: "TIER_1_JOB_READY" | "TIER_2_COMPETENT" | "TIER_3_DEVELOPING" | "TIER_4_FOUNDATIONAL";
  componentScores: {
    skillReadiness: number;
    evidenceStrength: number;
    experienceAlignment: number;
    marketAlignment: number;
    applicationReadiness: number;
  };
  disclaimer: "THIS IS AN INTELLIGENCE INDICATOR, NOT A GUARANTEE OF EMPLOYMENT.";
  explanation: string;
  confidence: number;
  generatedAt: string;
}

export interface CopilotChatQuery {
  candidateId: string;
  message: string;
  context?: {
    activeGoalRoleId?: string;
    activeJobId?: string;
    activeSkillId?: string;
  };
}

export interface CopilotChatResponse {
  answer: string;
  reason: string;
  supportingData: {
    relevantSkills: string[];
    readinessScore?: number;
    marketDemandVolume?: number;
    matchingJobsCount?: number;
    recommendedCourseTitles?: string[];
  };
  suggestedNextActions: string[];
  confidence: number;
  limitations: string;
  isGroundedInDeterministicData: true;
}

export interface ICareerAIProvider {
  processCareerQuery(query: CopilotChatQuery): Promise<CopilotChatResponse>;
}
