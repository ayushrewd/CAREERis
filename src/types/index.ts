// ==============================================================================
// CAREERIS DOMAIN TYPES & INTERFACES
// India Career, Skill & Labour-Market Intelligence Platform
// ==============================================================================

export type UserRole =
  | "CANDIDATE"
  | "TRAINING_PROVIDER"
  | "ITI_ADMIN"
  | "INSTRUCTOR"
  | "ASSESSOR"
  | "EMPLOYER"
  | "GOVERNMENT_ADMIN"
  | "NATIONAL_GOVERNMENT"
  | "STATE_GOVERNMENT"
  | "DISTRICT_ADMIN"
  | "STATE_ADMIN"
  | "PROGRAM_ADMIN"
  | "PROGRAM_MANAGER"
  | "SCHEME_MANAGER"
  | "SKILL_DEVELOPMENT_ADMIN"
  | "INDUSTRY_COUNCIL"
  | "MONITORING_OFFICER"
  | "POLICY_ANALYST"
  | "PLATFORM_ADMIN";

export type ProficiencyLevel =
  | "FOUNDATIONAL"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT"
  | "MASTER";

export type EvidenceVerificationStatus =
  | "UNVERIFIED"
  | "SELF_ATTESTED"
  | "ASSESSMENT_VERIFIED"
  | "INSTITUTE_VERIFIED"
  | "EMPLOYER_VERIFIED"
  | "AI_PROCTORED_VERIFIED"
  | "THIRD_PARTY_CREDENTIALED"
  | "VERIFIED"
  | "CLAIMED"
  | "COURSE_COMPLETED";

export type DataSourceType =
  | "JOB_POSTINGS"
  | "EMPLOYER_SURVEYS"
  | "INDUSTRY_CONSULTATION"
  | "TRAINING_DATA"
  | "PLACEMENT_DATA"
  | "GOVERNMENT_DATA"
  | "SECTOR_DATA"
  | "TECHNOLOGY_TRENDS"
  | "USER_GENERATED"
  | "MANUAL_ADMIN"
  | "IMPORTED_DATA";

export type NotificationType =
  | "JOB_MATCH"
  | "APPLICATION_UPDATE"
  | "ASSESSMENT"
  | "MESSAGE"
  | "INTERVIEW"
  | "SKILL_VERIFICATION"
  | "LEARNING"
  | "COURSE"
  | "SYSTEM"
  | "GOVERNMENT_ALERT"
  | "DATA_ALERT"
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  organizationName?: string;
  departmentName?: string;
  phone?: string;
  avatarUrl?: string;
  headline?: string;
  college?: string;
  education?: string;
  qualification?: string;
  experience?: string;
  state?: string;
  district?: string;
  targetRole?: string;
  skills?: string[];
  avatarBg?: string;
  verifiedScore?: number;
  bio?: string;
  githubUrl?: string;
  roleType: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  preferredLocale: string;
  lastLoginAt?: string;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// GEOGRAPHY
// ------------------------------------------------------------------------------

export interface Country {
  id: string;
  code: string;
  name: string;
  iso3: string;
}

export interface State {
  id: string;
  countryId: string;
  code: string;
  name: string;
  isUT: boolean;
  isPilotArea: boolean; // Maharashtra SIH Pilot context
  capital: string;
  regionCount?: number;
  districtCount?: number;
}

export interface Region {
  id: string;
  stateId: string;
  code: string;
  name: string;
}

export interface District {
  id: string;
  stateId: string;
  regionId?: string;
  code: string;
  name: string;
  headquarters: string;
  stateName?: string;
  industrialClustersCount?: number;
}

export interface IndustrialCluster {
  id: string;
  districtId: string;
  code: string;
  name: string;
  sectorFocus: string[];
  activeUnits: number;
}

// ------------------------------------------------------------------------------
// SKILLS & GRAPH
// ------------------------------------------------------------------------------

export interface SkillCategory {
  id: string;
  code: string;
  name: string;
}

export interface Skill {
  id: string;
  categoryId: string;
  categoryName?: string;
  code: string;
  name: string;
  description: string;
  isEmerging: boolean;
  isGreenSkill: boolean;
  demandGrowthYoY?: number;
  openJobRequisitions?: number;
  aliases?: string[];
}

export interface SkillRelationship {
  id: string;
  sourceSkillId: string;
  targetSkillId: string;
  relationType: "PREREQUISITE" | "RELATED" | "SPECIALIZATION_OF" | "SYNONYMOUS_WITH" | "COMMONLY_PAIRED_WITH";
  weight: number;
}

// ------------------------------------------------------------------------------
// CANDIDATE PROFILE & EVIDENCE
// ------------------------------------------------------------------------------

export interface CandidateSkillItem {
  skillId: string;
  skillName: string;
  claimedProficiency: ProficiencyLevel;
  assessedScore?: number; // 0 - 100
  verificationStatus: EvidenceVerificationStatus;
  verifiedAt?: string;
  evidenceCount?: number;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  currentDistrict: string;
  currentState: string;
  readinessScore: number; // 0 - 100
  skills: CandidateSkillItem[];
  education: Array<{
    id: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate?: string;
    endDate?: string;
    startYear?: number;
    endYear?: number;
    grade?: string;
  }>;
  experience: Array<{
    id: string;
    companyName: string;
    jobTitle?: string;
    role?: string;
    district?: string;
    state?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
  }>;
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    skillsUsed?: string[];
    evidenceUrl?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    verificationUrl?: string;
  }>;
}

// ------------------------------------------------------------------------------
// EMPLOYER & JOBS
// ------------------------------------------------------------------------------

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  cinNumber?: string;
  industry: string;
  website?: string;
  logoUrl?: string;
  description: string;
  headquarters: string;
  isVerified: boolean;
  activeJobsCount?: number;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  jobType: "FULL_TIME" | "PART_TIME" | "APPRENTICESHIP" | "INTERNSHIP" | "CONTRACT" | "HYBRID" | "REMOTE";
  minExperience: number;
  maxExperience?: number;
  salaryRangeINR: {
    min: number;
    max: number;
  };
  openPositions: number;
  district: string;
  state: string;
  requiredSkills: Array<{
    skillId: string;
    name: string;
    level: ProficiencyLevel;
    isMandatory: boolean;
  }>;
  createdAt: string;
  isDemoData?: boolean;
}

// ------------------------------------------------------------------------------
// TRAINING & COURSES
// ------------------------------------------------------------------------------

export interface TrainingProvider {
  id: string;
  code: string;
  name: string;
  providerType: "ITI" | "POLYTECHNIC" | "NSTI" | "PRIVATE_VOCATIONAL" | "UNIVERSITY";
  headquarters: string;
  district: string;
  state: string;
  isAccredited: boolean;
  totalCourses?: number;
  trainerCount?: number;
}

export interface Course {
  id: string;
  trainingProviderId: string;
  trainingProviderName: string;
  code: string;
  title: string;
  description: string;
  durationHours: number;
  capacity: number;
  enrolledCount?: number;
  healthScore: number; // 0 - 100
  curriculumAligned: boolean;
  skillsTaught: Array<{
    skillId: string;
    name: string;
    targetLevel: ProficiencyLevel;
  }>;
  equipmentAvailable: string[];
}

// ------------------------------------------------------------------------------
// DATA SOURCE & AUDIT
// ------------------------------------------------------------------------------

export interface DataSource {
  id: string;
  name: string;
  sourceType: DataSourceType;
  collectionDate: string;
  timePeriod: string;
  geographyScope: string;
  confidence: number; // 0 - 100
  methodology: string;
  version: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// NOTIFICATION
// ------------------------------------------------------------------------------

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  requestId?: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    headline?: string | null;
    roleType?: string;
  };
}
