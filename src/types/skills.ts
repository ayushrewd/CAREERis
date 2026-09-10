// ==============================================================================
// CAREERIS UNIFIED SKILL GRAPH & INTELLIGENCE TYPE SYSTEM
// Everything connects through Canonical Skills
// ==============================================================================

export type SkillType =
  | "TECHNICAL"
  | "DIGITAL"
  | "SOFT"
  | "DOMAIN"
  | "TOOLS"
  | "LANGUAGE"
  | "GREEN"
  | "EMERGING"
  | "TRANSVERSAL";

export type SkillRelationshipType =
  | "RELATED"
  | "PREREQUISITE"
  | "COMPLEMENTARY"
  | "SUBSKILL"
  | "SUPER_SKILL"
  | "ALTERNATIVE"
  | "CO_OCCURS_WITH";

export type ProficiencyLevelNumeric = 1 | 2 | 3 | 4 | 5; // 1-Awareness, 2-Basic, 3-Intermediate, 4-Advanced, 5-Expert

export type ProficiencyLabel =
  | "FOUNDATIONAL"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT"
  | "MASTER";

export type UnresolvedSkillStatus =
  | "UNRESOLVED"
  | "REVIEW_REQUIRED"
  | "RESOLVED"
  | "REJECTED";

export interface SkillCategory {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface SkillAlias {
  id: string;
  skillId: string;
  alias: string;
  normalizedAlias: string;
  source: string; // "DICTIONARY", "USER_INPUT", "EMPLOYER_POSTING", "CURRICULUM"
  confidence: number; // 0.0 - 1.0
  status: "ACTIVE" | "PENDING_REVIEW" | "DEPRECATED";
  createdAt: string;
}

export interface SkillRelationship {
  id: string;
  sourceSkillId: string;
  targetSkillId: string;
  targetSkillName?: string;
  relationType: SkillRelationshipType;
  weight: number; // 0.0 - 1.0
  confidence: number; // 0.0 - 1.0
  source: string;
  createdAt: string;
}

export interface CanonicalSkill {
  id: string;
  code: string;
  name: string; // Canonical name e.g. "Python"
  canonicalName: string;
  normalizedName: string; // Lowercase clean e.g. "python"
  description: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  skillType: SkillType;
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED";
  version: number;
  isEmerging: boolean;
  isGreenSkill: boolean;
  aliases: SkillAlias[];
  outgoingRelations: SkillRelationship[];
  incomingRelations: SkillRelationship[];
  createdAt: string;
  updatedAt: string;
}

export interface UnresolvedSkillRecord {
  id: string;
  rawText: string;
  normalizedText: string;
  context?: string;
  sourceEntity: "JOB_POSTING" | "CANDIDATE_RESUME" | "COURSE_SYLLABUS" | "ASSESSMENT" | "MANUAL";
  sourceEntityId?: string;
  confidence: number;
  status: UnresolvedSkillStatus;
  resolvedSkillId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NormalizationResult {
  status: "RESOLVED" | "UNRESOLVED" | "REVIEW_REQUIRED";
  rawInput: string;
  normalizedInput: string;
  canonicalSkill?: CanonicalSkill;
  matchedBy?: "EXACT_CANONICAL" | "NORMALIZED_NAME" | "ALIAS" | "ABBREVIATION" | "EMBEDDING_SEMANTIC";
  confidence: number; // 0.0 - 1.0
  candidateMatches?: Array<{
    skill: CanonicalSkill;
    score: number;
    reason: string;
  }>;
}

// ------------------------------------------------------------------------------
// EVIDENCE & PROFICIENCY SCORING
// ------------------------------------------------------------------------------

export interface EvidenceBreakdown {
  assessmentWeight: number;    // default: 0.40
  certificationWeight: number; // default: 0.25
  employerWeight: number;      // default: 0.20
  projectWeight: number;       // default: 0.10
  selfReportWeight: number;    // default: 0.05
}

export interface SkillEvidenceConfidence {
  skillId: string;
  skillName: string;
  calculatedProficiency: ProficiencyLabel;
  calculatedScore: number; // 0 - 100
  confidenceRating: "HIGH" | "MEDIUM" | "LOW";
  confidenceScore: number; // 0.0 - 1.0
  evidenceShares: {
    assessmentPct: number;
    certificationPct: number;
    employerPct: number;
    projectPct: number;
    selfReportPct: number;
  };
  explanation: string;
}

// ------------------------------------------------------------------------------
// ROLE-SKILL & JOB-SKILL MODELS
// ------------------------------------------------------------------------------

export interface RoleSkillRequirement {
  skillId: string;
  skillName: string;
  isMandatory: boolean;
  importance: "CRITICAL" | "HIGH" | "MEDIUM" | "NICE_TO_HAVE";
  minProficiency: ProficiencyLabel;
  weight: number;
}

export interface CanonicalRole {
  id: string;
  code: string;
  title: string;
  description: string;
  nsqfLevel?: number;
  sectorId: string;
  sectorName: string;
  coreSkills: RoleSkillRequirement[];
  preferredSkills: RoleSkillRequirement[];
  typicalSalaryRangeINR: { min: number; max: number };
}

// ------------------------------------------------------------------------------
// SKILL GAP & EXPLAINABLE MATCHING
// ------------------------------------------------------------------------------

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  requiredProficiency: ProficiencyLabel;
  currentProficiency: ProficiencyLabel | "NONE";
  gapStatus: "MET" | "PARTIAL" | "MISSING";
  gapLevel: number; // 0 = Met, 1 = 1 level gap, 2+ = Major gap
  evidenceConfidence: number; // 0.0 - 1.0
  prerequisites: string[];
  recommendedCourseId?: string;
  recommendedCourseTitle?: string;
}

export interface ExplainableMatchBreakdown {
  overallScore: number; // 0 - 100
  factorBreakdown: {
    skillCoverageScore: number;   // 0 - 100 (weight 40%)
    proficiencyFitScore: number;   // 0 - 100 (weight 25%)
    evidenceQualityScore: number;  // 0 - 100 (weight 15%)
    experienceScore: number;       // 0 - 100 (weight 10%)
    locationScore: number;         // 0 - 100 (weight 10%)
  };
  strengths: Array<{ skillName: string; detail: string }>;
  partialMatches: Array<{ skillName: string; current: string; required: string }>;
  missingSkills: Array<{ skillName: string; importance: string }>;
  recommendedActions: string[];
}

export interface RecommendedLearningStep {
  stepNumber: number;
  type: "PREREQUISITE" | "COURSE" | "PROJECT" | "ASSESSMENT" | "VERIFICATION";
  skillId: string;
  skillName: string;
  targetProficiency: ProficiencyLabel;
  title: string;
  description: string;
  estimatedHours: number;
  entityId?: string;
  providerName?: string;
}

export interface RecommendedLearningPath {
  candidateId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  totalEstimatedHours: number;
  skillsCovered: string[];
  steps: RecommendedLearningStep[];
}

// ------------------------------------------------------------------------------
// EMBEDDING & SEMANTIC MATCHING ABSTRACTIONS
// ------------------------------------------------------------------------------

export interface SkillEmbeddingRecord {
  id: string;
  skillId: string;
  embedding: number[];
  model: string;
  modelVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmbeddingProvider {
  embedText(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export interface ISkillResolver {
  resolve(rawText: string, context?: string): Promise<NormalizationResult>;
}
