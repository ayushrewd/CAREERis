import { describe, it, expect } from "vitest";
import { aiLearningAdvisorService } from "@/server/services/training/aiLearningAdvisorService";

describe("Grounded AI Learning Advisor", () => {
  it("should explain why a course is recommended and cite empirical prerequisites and health scores", async () => {
    const response = await aiLearningAdvisorService.askLearningAdvisor({
      candidateId: "cand-rohit-01",
      query: "Which course will help me bridge my BMS gap?",
    });

    expect(response.answerText).toContain("Government ITI Aundh");
    expect(response.recommendedCourses.length).toBeGreaterThan(0);
    expect(response.evidenceCited.length).toBeGreaterThan(0);
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(response.prerequisitesNeeded.length).toBeGreaterThan(0);
  });
});
