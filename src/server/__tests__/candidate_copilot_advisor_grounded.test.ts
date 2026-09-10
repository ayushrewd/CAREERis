import { describe, it, expect } from "vitest";
import { groundedCareerCopilotAdvisorService } from "@/server/services/career/groundedCareerCopilotAdvisorService";

describe("Grounded AI Candidate Career Copilot Advisor", () => {
  it("should answer candidate questions citing verified skill credentials and live employer requisitions", async () => {
    const response = await groundedCareerCopilotAdvisorService.askCareerCopilot({
      candidateId: "cand-rohit-01",
      query: "Why am I not ready for the EV BMS role?",
    });

    expect(response.answerText).toContain("84% ready");
    expect(response.answerText).toContain("Battery Management Systems (BMS)");
    expect(response.evidenceCited.length).toBeGreaterThan(0);
    expect(response.recommendedNextActions.length).toBeGreaterThan(0);
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
  });
});
