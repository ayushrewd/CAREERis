import { describe, it, expect } from "vitest";
import { nationalPolicyIntelligenceService } from "@/server/services/government/nationalPolicyIntelligenceService";
import { districtActionPlanService } from "@/server/services/government/districtActionPlanService";
import { schemeIntelligenceService } from "@/server/services/government/schemeIntelligenceService";
import { policyScenarioSimulatorService } from "@/server/services/government/policyScenarioSimulatorService";
import { groundedPolicyAdvisorService } from "@/server/services/government/groundedPolicyAdvisorService";

describe("Golden Government Policy Intelligence & Decision Command Center Closed-Loop Journey", () => {
  it("should execute the complete public-sector lifecycle from national signal to audited policy intervention sanction", async () => {
    // 1. National Labour Demand & Scarcity Aggregation
    const nationalData = await nationalPolicyIntelligenceService.getNationalIntelligence();
    expect(nationalData.totalActiveNationalDemand).toBe(4850000);
    expect(nationalData.netNationalSkillGap).toBe(1610000);

    // 2. Early Warning Alert Ingestion
    const alerts = await nationalPolicyIntelligenceService.getCriticalAlerts("CRITICAL");
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].cluster).toContain("Chakan Automotive Hub");

    // 3. Grounded AI Policy Advisor Query
    const advisorResponse = await groundedPolicyAdvisorService.askPolicyAdvisor({
      userId: "user-principal-sec",
      query: "Which district has the largest skill gap and what is the optimal intervention?",
    });
    expect(advisorResponse.answerText).toContain("Pune district");
    expect(advisorResponse.recommendedInterventions.length).toBeGreaterThan(0);

    // 4. District Skill Action Plan Review
    const plans = await districtActionPlanService.getActionPlans("Pune");
    expect(plans.length).toBe(1);
    const punePlan = plans[0];
    expect(punePlan.priorityClassification).toBe("CRITICAL");
    expect(punePlan.keyDeficitSkills[0].skillName).toContain("Battery Management Systems");

    // 5. Policy What-If Scenario Simulation
    const scenarios = await policyScenarioSimulatorService.getScenarios();
    const evScenario = scenarios.find((s) => s.scenarioType === "SEAT_EXPANSION");
    expect(evScenario).toBeDefined();
    expect(evScenario?.projectedSkillGapReductionPercentage).toBe(41.7);
    expect(evScenario?.estimatedCostINR).toBe(62000000);

    // 6. Scheme Budget Allocation
    const schemes = await schemeIntelligenceService.getSchemes();
    const pmkvy = schemes.find((s) => s.schemeCode === "PMKVY_4_SPECIAL");
    expect(pmkvy).toBeDefined();
    expect(pmkvy?.allocatedBudgetINR).toBe(1200000000);

    // 7. Audited Policy Decision Approval
    const decision = await districtActionPlanService.approvePolicyDecision({
      actionPlanId: punePlan.planId,
      decisionTitle: "Formal Sanction: Pune EV COE Capacity Expansion",
      decisionMakerName: "Dr. Sanjay Chahande (IAS), Principal Secretary",
      allocatedBudgetINR: 185000000,
      targetSkillGapReductionPercentage: 75,
      rationale: "Approved under PMKVY 4.0 Special Project Fund based on CAREERIS ground-truth demand evidence.",
    });

    expect(decision.decisionId).toBeDefined();
    expect(decision.auditSignature).toContain("policydec");
    expect(decision.targetSkillGapReductionPercentage).toBe(75);
  });
});
