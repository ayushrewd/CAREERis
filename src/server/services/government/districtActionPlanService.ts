// ==============================================================================
// CAREERIS DISTRICT SKILL ACTION PLAN SERVICE
// Priority Scoring, Baseline vs Target Capacity & Action Plan Lifecycle
// ==============================================================================

import { policyIntelligenceRepository } from "@/server/repositories/policyIntelligenceRepository";
import { DistrictSkillActionPlanRecord, PolicyDecisionRecord } from "@/types/policyIntelligence";

export const districtActionPlanService = {
  async getActionPlans(district?: string): Promise<DistrictSkillActionPlanRecord[]> {
    return policyIntelligenceRepository.getActionPlans(district);
  },

  async createActionPlan(plan: Partial<DistrictSkillActionPlanRecord>): Promise<DistrictSkillActionPlanRecord> {
    return policyIntelligenceRepository.createActionPlan(plan);
  },

  async getPolicyDecisions(): Promise<PolicyDecisionRecord[]> {
    return policyIntelligenceRepository.getDecisions();
  },

  async approvePolicyDecision(decision: Partial<PolicyDecisionRecord>): Promise<PolicyDecisionRecord> {
    return policyIntelligenceRepository.recordDecision(decision);
  },
};
