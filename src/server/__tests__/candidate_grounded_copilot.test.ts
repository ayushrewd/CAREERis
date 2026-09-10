import { describe, it, expect } from "vitest";
import { careerCopilotGroundedService } from "@/server/services/career/careerCopilotGroundedService";

describe("Grounded Career Copilot", () => {
  it("should answer candidate questions with explicit evidence and zero hallucination", async () => {
    const jobAnswer = await careerCopilotGroundedService.askCareerCopilot({
      candidateId: "cand-rohit-01",
      query: "What jobs fit me?",
    });

    expect(jobAnswer.answerText).toContain("EV Battery System Calibration Specialist");
    expect(jobAnswer.evidenceCited.length).toBeGreaterThan(0);
    expect(jobAnswer.confidenceScore).toBeGreaterThan(90);
    expect(jobAnswer.limitations).toBeDefined();
    expect(jobAnswer.nextBestActions.length).toBeGreaterThan(0);

    const learnAnswer = await careerCopilotGroundedService.askCareerCopilot({
      candidateId: "cand-rohit-01",
      query: "What course should I learn next to close my gap?",
    });

    expect(learnAnswer.answerText).toContain("Battery Management Systems");
    expect(learnAnswer.marketDemandSignal).toBeDefined();
  });
});
