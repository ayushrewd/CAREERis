import { describe, it, expect } from "vitest";
import { careerCopilotService } from "@/server/services/career/careerCopilotService";
import { employabilityScoreService } from "@/server/services/career/employabilityScoreService";

describe("Career Journey: Grounded AI Copilot & Employability Index", () => {
  it("provides deterministic grounded answers for career learning questions", async () => {
    const response = await careerCopilotService.chat({
      candidateId: "cand-rohit-01",
      message: "What skill should I learn next?",
    });

    expect(response.isGroundedInDeterministicData).toBe(true);
    expect(response.answer.length).toBeGreaterThan(0);
    expect(response.supportingData.relevantSkills.length).toBeGreaterThan(0);
    expect(response.suggestedNextActions.length).toBeGreaterThan(0);
  });

  it("calculates multi-component employability indicator with mandatory disclaimer", async () => {
    const indicator = await employabilityScoreService.calculateEmployabilityScore("cand-rohit-01");
    expect(indicator.score).toBeGreaterThanOrEqual(70);
    expect(indicator.disclaimer).toBe("THIS IS AN INTELLIGENCE INDICATOR, NOT A GUARANTEE OF EMPLOYMENT.");
    expect(indicator.componentScores.skillReadiness).toBeGreaterThan(0);
    expect(indicator.componentScores.evidenceStrength).toBeGreaterThan(0);
  });
});
