// ==============================================================================
// CAREERIS POLICY INTELLIGENCE REPOSITORY
// National Metrics, Schemes, Action Plans, Scenarios, Alerts & Policy Decisions
// ==============================================================================

import {
  SchemeIntelligenceRecord,
  DistrictSkillActionPlanRecord,
  PolicyScenarioModel,
  GovernmentAlertRecord,
  PolicyDecisionRecord,
} from "@/types/policyIntelligence";
import {
  CANONICAL_NATIONAL_METRICS,
  CANONICAL_SCHEMES,
  CANONICAL_ACTION_PLANS,
  CANONICAL_POLICY_SCENARIOS,
  CANONICAL_GOVERNMENT_ALERTS,
  CANONICAL_POLICY_DECISIONS,
} from "@/data/canonicalPolicyIntelligenceData";

let inMemoryNational = JSON.parse(JSON.stringify(CANONICAL_NATIONAL_METRICS));
let inMemorySchemes: SchemeIntelligenceRecord[] = JSON.parse(JSON.stringify(CANONICAL_SCHEMES));
let inMemoryActionPlans: DistrictSkillActionPlanRecord[] = JSON.parse(JSON.stringify(CANONICAL_ACTION_PLANS));
let inMemoryScenarios: PolicyScenarioModel[] = JSON.parse(JSON.stringify(CANONICAL_POLICY_SCENARIOS));
let inMemoryAlerts: GovernmentAlertRecord[] = JSON.parse(JSON.stringify(CANONICAL_GOVERNMENT_ALERTS));
let inMemoryDecisions: PolicyDecisionRecord[] = JSON.parse(JSON.stringify(CANONICAL_POLICY_DECISIONS));

export const policyIntelligenceRepository = {
  async getNationalMetrics(): Promise<any> {
    return JSON.parse(JSON.stringify(inMemoryNational));
  },

  async getSchemes(): Promise<SchemeIntelligenceRecord[]> {
    return JSON.parse(JSON.stringify(inMemorySchemes));
  },

  async getActionPlans(district?: string): Promise<DistrictSkillActionPlanRecord[]> {
    if (district) {
      return JSON.parse(JSON.stringify(inMemoryActionPlans.filter((p) => p.district.toLowerCase() === district.toLowerCase())));
    }
    return JSON.parse(JSON.stringify(inMemoryActionPlans));
  },

  async createActionPlan(plan: Partial<DistrictSkillActionPlanRecord>): Promise<DistrictSkillActionPlanRecord> {
    const newPlan: DistrictSkillActionPlanRecord = {
      planId: `dsap-${Date.now()}`,
      district: plan.district || "Pune",
      state: plan.state || "Maharashtra",
      priorityScore: plan.priorityScore || 85,
      priorityClassification: plan.priorityClassification || "HIGH",
      keyDeficitSkills: plan.keyDeficitSkills || [],
      baselineTrainingCapacitySeats: plan.baselineTrainingCapacitySeats || 5000,
      targetTrainingCapacitySeats: plan.targetTrainingCapacitySeats || 7000,
      approvedInterventionsCount: plan.approvedInterventionsCount || 1,
      allocatedBudgetINR: plan.allocatedBudgetINR || 100000000,
      status: "APPROVED",
      leadOfficerName: plan.leadOfficerName || "District Officer",
      lastUpdatedAt: new Date().toISOString(),
    };
    inMemoryActionPlans.push(newPlan);
    return newPlan;
  },

  async getScenarios(): Promise<PolicyScenarioModel[]> {
    return JSON.parse(JSON.stringify(inMemoryScenarios));
  },

  async createScenario(scenario: Partial<PolicyScenarioModel>): Promise<PolicyScenarioModel> {
    const newScen: PolicyScenarioModel = {
      scenarioId: `scen-${Date.now()}`,
      title: scenario.title || "Custom Policy Scenario",
      description: scenario.description || "Simulated intervention model",
      scenarioType: scenario.scenarioType || "SEAT_EXPANSION",
      scopeGeography: scenario.scopeGeography || "Pan-India",
      baselineSeats: scenario.baselineSeats || 5000,
      simulatedSeats: scenario.simulatedSeats || 7500,
      baselineSkillGap: scenario.baselineSkillGap || 2500,
      projectedSkillGapReductionPercentage: scenario.projectedSkillGapReductionPercentage || 50,
      estimatedCostINR: scenario.estimatedCostINR || 50000000,
      timeToImpactWeeks: scenario.timeToImpactWeeks || 12,
      confidenceScore: 92,
      riskAnalysis: "Modeled statistical estimate based on historical capacity absorption rates.",
      assumptions: scenario.assumptions || ["Capacity expansion within projected budget"],
    };
    inMemoryScenarios.push(newScen);
    return newScen;
  },

  async getAlerts(severity?: string): Promise<GovernmentAlertRecord[]> {
    if (severity) {
      return JSON.parse(JSON.stringify(inMemoryAlerts.filter((a) => a.severity === severity)));
    }
    return JSON.parse(JSON.stringify(inMemoryAlerts));
  },

  async createAlert(alert: Partial<GovernmentAlertRecord>): Promise<GovernmentAlertRecord> {
    const newAlt: GovernmentAlertRecord = {
      alertId: `alt-${Date.now()}`,
      severity: alert.severity || "HIGH",
      title: alert.title || "Early Warning Alert",
      description: alert.description || "Automated alert",
      triggerType: alert.triggerType || "SKILL_DEFICIT",
      state: alert.state || "Maharashtra",
      district: alert.district,
      affectedSkills: alert.affectedSkills || [],
      evidenceSource: alert.evidenceSource || "CAREERIS Ingestion Signal",
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
    };
    inMemoryAlerts.push(newAlt);
    return newAlt;
  },

  async getDecisions(): Promise<PolicyDecisionRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryDecisions));
  },

  async recordDecision(decision: Partial<PolicyDecisionRecord>): Promise<PolicyDecisionRecord> {
    const newDec: PolicyDecisionRecord = {
      decisionId: `dec-${Date.now()}`,
      actionPlanId: decision.actionPlanId,
      interventionId: decision.interventionId,
      decisionTitle: decision.decisionTitle || "Policy Decision Approval",
      decisionMakerName: decision.decisionMakerName || "Principal Secretary",
      decisionMakerRole: "GOVERNMENT_ADMIN",
      approvedAt: new Date().toISOString(),
      rationale: decision.rationale || "Approved for immediate execution",
      allocatedBudgetINR: decision.allocatedBudgetINR || 50000000,
      targetSkillGapReductionPercentage: decision.targetSkillGapReductionPercentage || 60,
      auditSignature: `SHA256:${Date.now()}policydec`,
    };
    inMemoryDecisions.push(newDec);
    return newDec;
  },
};
