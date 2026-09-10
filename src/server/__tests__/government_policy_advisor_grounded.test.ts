import { describe, it, expect } from "vitest";
import { groundedPolicyAdvisorService } from "@/server/services/government/groundedPolicyAdvisorService";

describe("Grounded AI Public-Sector Policy Advisor", () => {
  it("should answer the core public-sector decision questions citing empirical signals and action plans", async () => {
    const response = await groundedPolicyAdvisorService.askPolicyAdvisor({
      userId: "user-sec-01",
      query: "Where are the largest skill gaps in India and what should government prioritize?",
    });

    expect(response.answerText).toContain("Pune district");
    expect(response.answerText).toContain("Battery Management Systems");
    expect(response.evidenceCited.length).toBeGreaterThan(0);
    expect(response.recommendedInterventions.length).toBeGreaterThan(0);
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(response.budgetImplicationINR).toBeGreaterThan(0);
  });
});
