// ==============================================================================
// CAREERIS EMPLOYER & RECRUITMENT INTELLIGENCE DOMAIN TYPES
// India Career, Skill & Labour-Market Intelligence Platform
// ==============================================================================

import { ProficiencyLevel, EvidenceVerificationStatus } from "@/types";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "APPRENTICESHIP" | "INTERNSHIP";

export type EmployerVerificationStatus = "VERIFIED" | "UNVERIFIED" | "PENDING_VERIFICATION" | "SUSPENDED";

export type RequisitionStatus = "DRAFT" | "PENDING_APPROVAL" | "OPEN" | "PAUSED" | "CLOSED" | "CANCELLED" | "FILLED";

export type HiringPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT" | "CRITICAL";

export type RecruitmentPipelineStage =
  | "APPLIED"
  | "VIEWED"
  | "SHORTLISTED"
  | "ASSESSMENT_REQUESTED"
  | "ASSESSMENT_COMPLETED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_COMPLETED"
  | "OFFERED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export type InterviewFormat = "TECHNICAL_PANEL" | "VIDEO_CALL" | "ON_SITE" | "PRACTICAL_DEMO" | "HR_DISCUSSION";

export type InterviewStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";

export type OfferStatus = "DRAFT" | "PENDING_APPROVAL" | "SENT" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export type HiringDifficultyCategory = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

export type HireVsTrainDecision = "HIRE" | "TRAIN" | "PARTNER" | "RELOCATE" | "REDEFINE_ROLE" | "WAIT";

export type PartnershipStatus = "PROPOSED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type PartnershipType =
  | "SPONSORED_TRAINING"
  | "INDUSTRY_PROJECT"
  | "APPRENTICESHIP"
  | "INTERNSHIP"
  | "CURRICULUM_FEEDBACK"
  | "ASSESSMENT_PARTNERSHIP"
  | "PLACEMENT_PARTNERSHIP";

// ------------------------------------------------------------------------------
// EMPLOYER PROFILE & ORGANIZATION
// ------------------------------------------------------------------------------

export interface EmployerLocation {
  id: string;
  name: string;
  isHeadquarters: boolean;
  address: string;
  city: string;
  district: string;
  state: string;
  stateCode: string;
  clusterId?: string;
  clusterName?: string;
  headcount: number;
}

export interface OrganizationUnit {
  id: string;
  name: string;
  code: string;
  type: "DIVISION" | "BUSINESS_UNIT" | "PLANT" | "R_AND_D_CENTER" | "CORPORATE";
  locationId: string;
  headOfUnit?: string;
  activeJobCount: number;
  workforceCount: number;
}

export interface HiringTeamMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: "EMPLOYER_ADMIN" | "HIRING_MANAGER" | "RECRUITER" | "INTERVIEWER";
  department: string;
  activeRequisitionsCount: number;
}

export interface EmployerVerificationRecord {
  status: EmployerVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  gstNumber?: string;
  cinNumber?: string;
  panNumber?: string;
  documentsSubmitted: Array<{
    documentType: "CIN_CERTIFICATE" | "GST_REGISTRATION" | "MSME_UDYAM" | "FACTORY_LICENSE";
    documentUrl: string;
    verified: boolean;
  }>;
  verificationNotes?: string;
}

export interface EmployerProfile {
  id: string;
  name: string;
  legalName: string;
  employerType: "ENTERPRISE" | "MSME" | "STARTUP" | "PUBLIC_SECTOR" | "MULTINATIONAL";
  industry: string;
  industryId: string;
  subIndustry?: string;
  companySize: "1-50" | "51-200" | "201-1000" | "1001-5000" | "5000+";
  workforceSize: number;
  organizationType: "PRIVATE_LIMITED" | "PUBLIC_LIMITED" | "PROPRIETORSHIP" | "PSU" | "LLP";
  headquarters: {
    city: string;
    district: string;
    state: string;
    stateCode: string;
    address: string;
  };
  operatingLocations: EmployerLocation[];
  organizationUnits: OrganizationUnit[];
  hiringTeam: HiringTeamMember[];
  website?: string;
  logoUrl?: string;
  description: string;
  verification: EmployerVerificationRecord;
  hiringStatus: "ACTIVELY_HIRING" | "SELECTIVE_HIRING" | "HIRING_FREEZE";
  skillsUsed: string[];
  rolesEmployed: string[];
  careerFamilies: string[];
  trainingPartnershipsCount: number;
  totalHiresToDate: number;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// JOB REQUISITIONS & QUALITY SCORE
// ------------------------------------------------------------------------------

export interface RequisitionSkillRequirement {
  skillId: string;
  skillName: string;
  minProficiency: ProficiencyLevel;
  isMandatory: boolean;
  importanceWeight: number; // 1 - 10
  expectedEvidenceTypes?: string[];
}

export interface JobQualityScore {
  overallScore: number; // 0 - 100
  grade: "A" | "B" | "C" | "NEEDS_IMPROVEMENT";
  breakdown: {
    skillClarity: number; // 0 - 100
    roleClarity: number;
    experienceClarity: number;
    locationClarity: number;
    compensationTransparency: number;
    descriptionCompleteness: number;
    educationClarity: number;
    assessmentClarity: number;
  };
  missingInformation: string[];
  recommendedImprovements: string[];
  isPublishable: boolean;
}

export interface JobRequisition {
  id: string;
  requisitionNumber: string;
  employerId: string;
  employerName: string;
  businessUnitId?: string;
  department: string;
  locationId: string;
  locationName: string;
  district: string;
  state: string;
  stateCode: string;
  clusterId?: string;
  clusterName?: string;
  jobTitle: string;
  canonicalRoleId: string;
  canonicalRoleTitle: string;
  industryId: string;
  employmentType: JobType;
  workMode: "ON_SITE" | "HYBRID" | "REMOTE";
  openings: number;
  filledPositions: number;
  minExperienceYears: number;
  maxExperienceYears?: number;
  educationRequirements: Array<{
    level: "ITI" | "DIPLOMA" | "GRADUATE" | "POST_GRADUATE" | "VOCATIONAL_CERTIFICATE";
    fieldOfStudy: string;
    isMandatory: boolean;
  }>;
  requiredSkills: RequisitionSkillRequirement[];
  preferredSkills: RequisitionSkillRequirement[];
  certificationsRequired: string[];
  salaryRangeINR: {
    min: number;
    max: number;
    isDisclosedToCandidates: boolean;
  };
  benefits: string[];
  description: string;
  responsibilities: string[];
  applicationDeadline?: string;
  hiringPriority: HiringPriority;
  hiringManagerId: string;
  hiringManagerName: string;
  assignedRecruiterId: string;
  assignedRecruiterName: string;
  status: RequisitionStatus;
  qualityScore: JobQualityScore;
  approvalHistory: Array<{
    stage: "SUBMITTED" | "APPROVED" | "RETURNED" | "REJECTED";
    actedBy: string;
    actedAt: string;
    comments?: string;
  }>;
  totalApplicantsCount: number;
  shortlistedCount: number;
  interviewingCount: number;
  offeredCount: number;
  hiredCount: number;
  createdAt: string;
  updatedAt: string;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// CANDIDATE MATCHING & DISCOVERY
// ------------------------------------------------------------------------------

export interface CandidateMatchFactor {
  name: string;
  weight: number;
  score: number;
  detail: string;
}

export interface EmployerCandidateMatchResult {
  candidateId: string;
  candidateName: string; // Redacted if privacy enabled
  headline: string;
  currentDistrict: string;
  currentState: string;
  overallMatchScore: number; // 0 - 100
  factors: {
    skillCoverage: CandidateMatchFactor;
    skillProficiency: CandidateMatchFactor;
    evidenceStrength: CandidateMatchFactor;
    experienceAlignment: CandidateMatchFactor;
    locationAlignment: CandidateMatchFactor;
    roleAlignment: CandidateMatchFactor;
    assessmentAlignment: CandidateMatchFactor;
  };
  matchingSkills: Array<{
    skillId: string;
    skillName: string;
    claimedProficiency: ProficiencyLevel;
    requiredProficiency: ProficiencyLevel;
    verificationStatus: EvidenceVerificationStatus;
    hasEvidence: boolean;
  }>;
  partialGaps: Array<{
    skillId: string;
    skillName: string;
    currentProficiency: ProficiencyLevel;
    requiredProficiency: ProficiencyLevel;
  }>;
  missingMandatorySkills: string[];
  whyThisCandidateMatches: string[];
  recommendedNextStep: "SHORTLIST_DIRECTLY" | "INVITE_TO_ASSESSMENT" | "SCHEDULE_TECHNICAL_INTERVIEW" | "HOLD";
  isVerifiedSkillPassportHolder: boolean;
  passportBadgeCount: number;
  privacyRestricted: boolean;
}

// ------------------------------------------------------------------------------
// RECRUITMENT PIPELINE & INTERVIEWS
// ------------------------------------------------------------------------------

export interface PipelineCandidateItem {
  applicationId: string;
  requisitionId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  currentStage: RecruitmentPipelineStage;
  matchScore: number;
  appliedAt: string;
  lastActivityAt: string;
  assignedRecruiterName: string;
  tags: string[];
  notesCount: number;
  rating?: number; // 1 - 5
}

export interface InterviewEvaluationCriteria {
  criteriaName: "TECHNICAL_SKILL" | "PROBLEM_SOLVING" | "DOMAIN_KNOWLEDGE" | "ROLE_FIT" | "COMMUNICATION" | "TOOL_PROFICIENCY";
  score: number; // 1 - 5
  feedbackComment: string;
}

export interface InterviewRecordDetail {
  id: string;
  applicationId: string;
  requisitionId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  roundNumber: number;
  roundName: string;
  format: InterviewFormat;
  scheduledAt: string;
  durationMinutes: number;
  locationOrMeetingLink: string;
  interviewerId: string;
  interviewerName: string;
  status: InterviewStatus;
  cancellationReason?: string;
  feedback?: {
    overallScore: number; // 1 - 5
    recommendation: "STRONG_HIRE" | "HIRE" | "NEUTRAL" | "DO_NOT_HIRE";
    evaluations: InterviewEvaluationCriteria[];
    summaryComments: string;
    assessedSkills: Array<{ skillId: string; skillName: string; assessedProficiency: ProficiencyLevel }>;
    submittedAt: string;
    submittedBy: string;
  };
}

export interface OfferRecordDetail {
  id: string;
  applicationId: string;
  requisitionId: string;
  candidateId: string;
  candidateName: string;
  employerId: string;
  employerName: string;
  roleTitle: string;
  annualCompensationINR: number;
  joiningDate: string;
  workLocation: string;
  employmentType: JobType;
  status: OfferStatus;
  offerLetterUrl?: string;
  candidateResponseAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// TALENT INTELLIGENCE & WORKFORCE PLANNING
// ------------------------------------------------------------------------------

export interface TalentAvailabilityMapItem {
  geographyScope: "STATE" | "DISTRICT" | "CLUSTER";
  geographyCode: string;
  geographyName: string;
  totalCandidatePool: number;
  verifiedSkillHolders: number;
  activelyLookingCount: number;
  inTrainingPipelineCount: number;
  graduatingNext90Days: number;
  demandVolume: number;
  hiringDifficultyIndex: HiringDifficultyCategory;
  medianSalaryOfferINR: number;
}

export interface SkillShortageInsight {
  skillId: string;
  skillName: string;
  category: string;
  annualRegionalDemand: number;
  verifiedTalentSupply: number;
  demandSupplyRatio: number;
  marketTightness: "LOOSE" | "BALANCED" | "TIGHT" | "ACUTE_SHORTAGE";
  isEmerging: boolean;
  hiringDifficulty: HiringDifficultyCategory;
  averageTimeToHireDays: number;
  topProducingInstitutions: Array<{ providerId: string; providerName: string; annualGraduates: number }>;
}

export interface WorkforcePlan {
  id: string;
  employerId: string;
  planTitle: string;
  planningPeriod: "Q1 2026" | "Q2 2026" | "FY 2026-2027" | "3_YEAR_EXPANSION";
  targetIndustry: string;
  businessUnit: string;
  rolesTargeted: Array<{
    roleId: string;
    roleTitle: string;
    targetHeadcount: number;
    currentHeadcount: number;
    currentOpenPositions: number;
    projectedAttrition: number;
    netHiringRequirement: number;
    targetTimelineMonths: number;
    priority: HiringPriority;
  }>;
  criticalSkillsNeeded: Array<{
    skillId: string;
    skillName: string;
    requiredProficiency: ProficiencyLevel;
    estimatedShortage: number;
  }>;
  hiringBudgetINR?: number;
  recommendedStrategy: {
    hireRatio: number; // percentage e.g. 60
    trainRatio: number; // percentage e.g. 40
    suggestedPartnerships: string[];
  };
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  createdAt: string;
}

export interface HireVsTrainAnalysis {
  roleId: string;
  roleTitle: string;
  skillId: string;
  skillName: string;
  headcountNeeded: number;
  decisionRecommendation: HireVsTrainDecision;
  confidenceScore: number;
  decisionFactors: {
    marketTalentAvailability: "HIGH" | "MODERATE" | "LOW" | "VERY_LOW";
    timeToHireDirectDays: number;
    timeToUpskillInternalDays: number;
    averageHiringCostINR: number;
    trainingCostPerCandidateINR: number;
    localTrainingCapacityAvailable: boolean;
    urgencyLevel: HiringPriority;
  };
  comparativeAnalysis: {
    directHiringPros: string[];
    directHiringRisks: string[];
    trainingPipelinePros: string[];
    trainingPipelineRisks: string[];
  };
  recommendedActionPlan: string;
  availableTrainingPartners: Array<{
    providerId: string;
    providerName: string;
    courseId: string;
    courseTitle: string;
    durationWeeks: number;
    healthScore: number;
  }>;
}

export interface TrainingPartnershipRecord {
  id: string;
  employerId: string;
  employerName: string;
  trainingProviderId: string;
  trainingProviderName: string;
  instituteDistrict: string;
  instituteState: string;
  partnershipType: PartnershipType;
  focusSkills: Array<{ skillId: string; skillName: string }>;
  enrolledStudentsCount: number;
  hiredFromCohortCount: number;
  status: PartnershipStatus;
  mouSigningDate: string;
  expiryDate: string;
  details: string;
}

// ------------------------------------------------------------------------------
// RECRUITMENT COPILOT & AI GROUNDING
// ------------------------------------------------------------------------------

export interface RecruitmentCopilotQuery {
  employerId: string;
  query: string;
  contextRequisitionId?: string;
  contextRoleId?: string;
  contextSkillId?: string;
  contextDistrict?: string;
}

export interface RecruitmentCopilotResponse {
  answer: string;
  groundingLabel: "FACT" | "FORECAST" | "SIMULATION" | "RECOMMENDATION" | "INSUFFICIENT_DATA";
  groundingData: {
    requisitionsAnalyzed?: number;
    candidatesAnalyzed?: number;
    skillsReferenced?: string[];
    geographiesReferenced?: string[];
    sourcesUsed?: string[];
  };
  suggestedFollowUpActions: Array<{
    title: string;
    actionUrl: string;
  }>;
}

export interface IRecruitmentAIProvider {
  askCopilot(query: RecruitmentCopilotQuery): Promise<RecruitmentCopilotResponse>;
}
