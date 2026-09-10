import { describe, it, expect } from "vitest";
import { districtActionPlanService } from "@/server/services/government/districtActionPlanService";

describe("District Skill Action Plans & Policy Decision Records", () => {
  it("should retrieve district action plans with priority scoring and deficit skills", async () => {
    const plans = await districtActionPlanService.getActionPlans();
    expect(plans.length).toBeGreaterThan(0);
    const punePlan = plans.find((p) => p.district === "Pune");
    expect(punePlan).toBeDefined();
    expect(punePlan?.priorityScore).toBe(94);
    expect(punePlan?.priorityClassification).toBe("CRITICAL");
    expect(punePlan?.keyDeficitSkills.length).toBeGreaterThan(0);
  });

  it("should approve policy decisions with cryptographic audit signatures", async () => {
    const decision = await districtActionPlanService.approvePolicyDecision({
      actionPlanId: "dsap-pune-2026",
      decisionTitle: "Sanction of ₹18.5 Cr Capacity Expansion",
      decisionMakerName: "Dr. Sanjay Chahande (IAS)",
      allocatedBudgetINR: 185000000,
      targetSkillGapReductionPercentage: 75,
    });

    expect(decision.decisionId).toBeDefined();
    expect(decision.auditSignature).toBeDefined();
    expect(decision.allocatedBudgetINR).toBe(185000000);
  });
});
