import { describe, it, expect } from "vitest";
import { employerAdvisorService } from "@/server/services/employer/employerAdvisorService";

describe("Grounded Employer AI Workforce Advisor", () => {
  it("should answer hiring difficulty and skill scarcity questions with cited evidence", async () => {
    const response = await employerAdvisorService.askAdvisor({
      employerId: "emp-tata-motors",
      query: "Which skills are hardest to hire in our cluster?",
    });

    expect(response.answerText).toContain("Battery Management Systems");
    expect(response.evidenceCited.length).toBeGreaterThan(0);
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(response.recommendedAction).toBeDefined();

    const trainResponse = await employerAdvisorService.askAdvisor({
      employerId: "emp-tata-motors",
      query: "Should we hire vs train existing mechanical technicians?",
    });

    expect(trainResponse.answerText).toContain("HYBRID STRATEGY");
  });
});
