// ==============================================================================
// CAREERIS POLICY INTELLIGENCE & PUBLIC-SECTOR DECISION DOMAIN TYPE SYSTEM
// Master Prompt 16: National Command Center, Schemes, District Plans & Policy Simulators
// ==============================================================================

import { UserRole } from "@/types";

export type GovernmentAlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface GovernmentAlertRecord {
  alertId: string;
  severity: GovernmentAlertSeverity;
  title: string;
  description: string;
  triggerType: "SKILL_DEFICIT" | "CAPACITY_CRISIS" | "COURSE_OBSOLESCENCE" | "EQUIPMENT_DEFICIT" | "PLACEMENT_DROP";
  state: string;
  district?: string;
  cluster?: string;
  affectedSkills: string[];
  evidenceSource: string;
  timestamp: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface SchemeIntelligenceRecord {
  schemeId: string;
  schemeCode: string;
  name: string;
  department: string;
  targetDemographic: string;
  targetGeographies: string[];
  alignedSkills: string[];
  allocatedBudgetINR: number;
  spentBudgetINR: number;
  totalEnrolledCount: number;
  totalCertifiedCount: number;
  placementRatePercentage: number;
  policyCoverageStatus: "SUFFICIENT" | "PARTIAL" | "POLICY_COVERAGE_GAP";
  gapExplanation?: string;
  lastAuditedAt: string;
}

export interface DistrictSkillActionPlanRecord {
  planId: string;
  district: string;
  state: string;
  priorityScore: number; // 0 - 100
  priorityClassification: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  keyDeficitSkills: Array<{
    skillName: string;
    annualDeficitHeadcount: number;
    severity: "CRITICAL" | "HIGH" | "MODERATE";
  }>;
  baselineTrainingCapacitySeats: number;
  targetTrainingCapacitySeats: number;
  approvedInterventionsCount: number;
  allocatedBudgetINR: number;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "IN_EXECUTION" | "EVALUATED";
  leadOfficerName: string;
  lastUpdatedAt: string;
}

export interface PolicyScenarioModel {
  scenarioId: string;
  title: string;
  description: string;
  scenarioType: "SEAT_EXPANSION" | "TRAINER_RETRAINING" | "LAB_MODERNIZATION" | "CURRICULUM_UPDATE" | "DEMAND_SURGE";
  scopeGeography: string;
  baselineSeats: number;
  simulatedSeats: number;
  baselineSkillGap: number;
  projectedSkillGapReductionPercentage: number;
  estimatedCostINR: number;
  timeToImpactWeeks: number;
  confidenceScore: number;
  riskAnalysis: string;
  assumptions: string[];
}

export interface PolicyDecisionRecord {
  decisionId: string;
  actionPlanId?: string;
  interventionId?: string;
  decisionTitle: string;
  decisionMakerName: string;
  decisionMakerRole: UserRole;
  approvedAt: string;
  rationale: string;
  allocatedBudgetINR: number;
  targetSkillGapReductionPercentage: number;
  auditSignature: string;
}

export interface GroundedPolicyAdvisorResponse {
  answerText: string;
  reasoningSteps: string[];
  evidenceCited: string[];
  recommendedInterventions: Array<{
    title: string;
    targetDistrict: string;
    targetSkill: string;
    estimatedCostINR: number;
    expectedImpact: string;
  }>;
  budgetImplicationINR: number;
  confidenceScore: number;
  limitations: string;
}
