// ==============================================================================
// CAREERIS LABOUR-MARKET INTELLIGENCE TYPE SYSTEM
// Everything connects through Canonical Skills
// ==============================================================================

export type SourceType =
  | "GOVERNMENT"
  | "PUBLIC_DATA"
  | "EMPLOYER"
  | "TRAINING_PROVIDER"
  | "INDUSTRY"
  | "ACADEMIC"
  | "JOB_MARKET"
  | "INTERNAL"
  | "SYNTHETIC";

export type IngestionFrequency =
  | "REAL_TIME"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUAL"
  | "ON_DEMAND";

export type SourceHealthStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "STALE"
  | "FAILED"
  | "DISABLED";

export interface DataSourceRecord {
  id: string;
  code: string;
  name: string;
  sourceType: SourceType;
  publisher: string;
  description: string;
  officialUrl?: string;
  collectionMethod: string;
  frequency: IngestionFrequency;
  coverage: string;
  geographyCoverage: string; // e.g. "PAN_INDIA", "MAHARASHTRA_PILOT", "KARNATAKA"
  lastCollectedAt?: string;
  nextExpectedCollection?: string;
  methodology: string;
  confidence: number; // 0.0 - 1.0
  license: string;
  status: SourceHealthStatus;
  isOfficial: boolean;
  isDemoData: boolean;
  recordsCount?: number;
  errorRate?: number;
}

export type IngestionJobStatus =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "PARTIAL"
  | "FAILED"
  | "CANCELLED";

export interface DataIngestionJob {
  id: string;
  sourceId: string;
  sourceName?: string;
  startedAt: string;
  completedAt?: string;
  status: IngestionJobStatus;
  recordsReceived: number;
  recordsAccepted: number;
  recordsRejected: number;
  recordsUpdated: number;
  recordsCreated: number;
  errors: string[];
  warnings: string[];
  checksum: string;
  executionMode: "AUTOMATIC" | "MANUAL" | "TEST_MOCK";
}

export interface RawRecord {
  id: string;
  sourceId: string;
  externalRecordId: string;
  rawPayload: Record<string, any>;
  receivedAt: string;
  checksum: string;
  processingStatus: "PENDING" | "PROCESSED" | "REJECTED" | "DUPLICATE";
  rejectionReason?: string;
}

export interface DataQualityReport {
  recordId?: string;
  qualityScore: number; // 0 - 100
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
  unresolvedGeography?: string;
  unresolvedSkills?: string[];
  unresolvedRoles?: string[];
}

export type DemandSignalType =
  | "JOB_POSTING"
  | "EMPLOYER_REQUEST"
  | "SURVEY"
  | "HIRING_EVENT"
  | "RECRUITMENT_SIGNAL"
  | "INDUSTRY_SIGNAL";

export interface DemandSignalRecord {
  id: string;
  skillId: string;
  skillName: string;
  roleId?: string;
  roleTitle?: string;
  industryId?: string;
  industryName?: string;
  employerId?: string;
  employerName?: string;
  stateCode: string;
  districtId?: string;
  districtName?: string;
  clusterId?: string;
  clusterName?: string;
  period: string; // e.g. "2026-Q2", "2026-08"
  signalType: DemandSignalType;
  volume: number;
  normalizedVolume: number;
  growthRateYoY?: number;
  sourceId: string;
  confidence: number;
  isDemoData: boolean;
  createdAt: string;
}

export interface JobMarketRecord {
  id: string;
  externalId?: string;
  sourceId: string;
  jobTitleRaw: string;
  normalizedRoleId?: string;
  normalizedRoleTitle?: string;
  employerName: string;
  employerId?: string;
  locationRaw: string;
  stateCode: string;
  districtId?: string;
  districtName?: string;
  clusterId?: string;
  industryId: string;
  industryName: string;
  skillsRaw: string[];
  canonicalSkillIds: string[];
  canonicalSkillNames: string[];
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";
  educationRequirements?: string;
  salaryRangeINR?: { min: number; max: number };
  employmentType: "FULL_TIME" | "CONTRACT" | "APPRENTICESHIP" | "PART_TIME";
  postedAt: string;
  confidence: number;
  isDemoData: boolean;
}

export interface CanonicalIndustry {
  id: string;
  code: string;
  name: string;
  sector: string;
  description: string;
  keySkills: string[];
  activeEmployersCount: number;
  annualHiringVolume: number;
  growthRateYoY: number;
  isEmergingSector: boolean;
}

export interface UnresolvedRoleRecord {
  id: string;
  rawTitle: string;
  normalizedTitle: string;
  context: string;
  sourceEntity: string;
  suggestedCanonicalRoleId?: string;
  confidence: number;
  status: "UNRESOLVED" | "REVIEW_REQUIRED" | "RESOLVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface SkillObservationRecord {
  id: string;
  rawTerm: string;
  normalizedTerm: string;
  skillId?: string;
  source: string;
  firstObservedAt: string;
  lastObservedAt: string;
  observationCount: number;
  industryCount: number;
  geographyCount: number;
  roleCount: number;
  confidence: number;
  status: "OBSERVED" | "EMERGING_CANDIDATE" | "STANDARDIZED" | "DISMISSED";
}

export interface SupplyBreakdownByTier {
  skillId: string;
  skillName: string;
  stateCode?: string;
  districtId?: string;
  period: string;
  // Distinct 6-Tier Supply Model
  potentialSupply: number;       // General diploma/degree holders in related stream
  learningSupply: number;        // Students currently enrolled in ITI/Polytechnic courses
  certifiedSupply: number;       // Completed course/earned certificate
  verifiedSkillSupply: number;   // Passed proctored diagnostic assessment or lab benchmark
  availableWorkforce: number;    // Verified candidates actively seeking placement
  placedWorkforce: number;       // Already placed/employed
  totalEffectiveSupply: number;  // De-duplicated operational supply
  confidence: number;
}

export type MarketTightness =
  | "VERY_TIGHT"
  | "TIGHT"
  | "BALANCED"
  | "SURPLUS"
  | "INSUFFICIENT_DATA";

export interface LabourMarketGapResult {
  skillId: string;
  skillName: string;
  category: string;
  stateCode?: string;
  districtId?: string;
  period: string;
  annualEmployerDemand: number;
  availableVerifiedSupply: number;
  learningPipelineSupply: number;
  netGap: number; // Demand - Available Verified Supply
  gapRatio: number; // Demand / Supply
  marketTightness: MarketTightness;
  gapPercentage: number;
  confidence: number;
  trend: "RISING_DEFICIT" | "STABLE" | "IMPROVING_SURPLUS" | "EMERGING";
  primaryDrivers: string[];
}

export type TrendClassification =
  | "RISING"
  | "STABLE"
  | "DECLINING"
  | "VOLATILE"
  | "INSUFFICIENT_DATA";

export interface SkillTrendMetric {
  skillId: string;
  skillName: string;
  currentPeriodDemand: number;
  previousPeriodDemand: number;
  growthRatePct: number;
  momentumScore: number; // Rate of acceleration
  volatilityIndex: number; // 0 (stable) to 1 (highly volatile)
  trendClassification: TrendClassification;
  confidence: number;
  historicalSeries: Array<{ period: string; volume: number }>;
}

export interface EmergingScoreBreakdown {
  demandGrowthFactor: number;      // 0 - 25 pts
  employerAdoptionFactor: number;  // 0 - 20 pts
  crossIndustryFactor: number;     // 0 - 20 pts
  geographicExpansionFactor: number;// 0 - 15 pts
  roleExpansionFactor: number;     // 0 - 10 pts
  trainingLagFactor: number;       // 0 - 10 pts (high demand but low ITI supply adds score)
}

export interface EmergingSkillMetric {
  skillId: string;
  skillName: string;
  category: string;
  emergingScore: number; // 0 - 100
  breakdown: EmergingScoreBreakdown;
  growthRateYoY: number;
  adoptingIndustriesCount: number;
  penetratedDistrictsCount: number;
  trainingLagRatio: number; // Demand / Training Capacity
  isCanonical: boolean;
  status: "EMERGING_HIGH_MOMENTUM" | "EMERGING_STEADY" | "CANDIDATE_FOR_STANDARDIZATION";
  firstDetectedPeriod: string;
  topIndustries: string[];
  topClusters: string[];
  explanation: string;
  confidence: number;
}

export interface CrossIndustryAdoptionRecord {
  skillId: string;
  skillName: string;
  primaryOriginIndustry: string;
  diffusionPattern: "RAPID_DIFFUSION" | "CONVERGING" | "NICHE_SPECIALIZED";
  industryDistribution: Array<{
    industryId: string;
    industryName: string;
    demandSharePct: number;
    headcountDemand: number;
    growthRateYoY: number;
  }>;
  diversityIndex: number; // Shannon entropy or Gini diversity 0-1
}

export interface CrossGeographyAdoptionRecord {
  skillId: string;
  skillName: string;
  nationalDemandTotal: number;
  topStates: Array<{ stateCode: string; stateName: string; demand: number; sharePct: number }>;
  topDistricts: Array<{ districtId: string; districtName: string; demand: number; netGap: number }>;
  topClusters: Array<{ clusterId: string; clusterName: string; demand: number }>;
  fastestGrowingDistricts: Array<{ districtName: string; growthRateYoY: number }>;
}

export interface CurriculumDemandAlignment {
  courseId: string;
  courseTitle: string;
  trainingProviderName: string;
  district: string;
  state: string;
  skillsTaught: Array<{
    skillId: string;
    skillName: string;
    targetProficiency: string;
    marketDemandUnits: number;
    marketDeficitUnits: number;
    isHighPriorityDeficit: boolean;
  }>;
  alignmentScore: number; // 0 - 100
  annualCapacity: number;
  annualCompletions: number;
  verifiedPassRate: number;
  placementRate: number;
  recommendedAction:
    | "EXPAND_SEATS"
    | "UPDATE_CURRICULUM_MODERNIZE"
    | "ALIGN_ASSESSMENT_LABS"
    | "MAINTAIN_STEADY"
    | "REVIEW_COURSE_RELEVANCE";
  rationale: string;
}

export interface IntelligenceAlertRecord {
  id: string;
  alertType:
    | "DEMAND_SPIKE"
    | "SUPPLY_DROP"
    | "NEW_EMERGING_SKILL"
    | "CRITICAL_DEFICIT_THRESHOLD"
    | "TRAINING_LAG_WARNING"
    | "DISTRICT_DETERIORATION";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  title: string;
  message: string;
  entityType: "SKILL" | "DISTRICT" | "STATE" | "INDUSTRY" | "COURSE";
  entityId: string;
  entityName: string;
  metricValue: number;
  thresholdValue: number;
  period: string;
  confidence: number;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: string;
}
