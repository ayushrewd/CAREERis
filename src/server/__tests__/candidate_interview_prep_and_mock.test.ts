import { describe, it, expect } from "vitest";
import { interviewPreparationService } from "@/server/services/career/interviewPreparationService";

describe("Interview Preparation & Mock Practice", () => {
  it("should retrieve role-specific technical and scenario interview questions", async () => {
    const session = await interviewPreparationService.getPrepSession();
    expect(session.questions.length).toBeGreaterThanOrEqual(3);
    expect(session.questions[0].relevantSkills.length).toBeGreaterThan(0);
    expect(session.questions[0].sampleGoodAnswer).toBeDefined();
  });

  it("should evaluate candidate mock answers with constructive AI feedback", async () => {
    const evaluation = await interviewPreparationService.submitMockAnswer({
      sessionId: "prep-tata-bms-01",
      questionId: "q-01",
      answerText: "I turn off the MSD switch and check the wires with a multimeter with PPE.",
    });

    expect(evaluation.score).toBeGreaterThan(60);
    expect(evaluation.strengths.length).toBeGreaterThan(0);
    expect(evaluation.areasForImprovement.length).toBeGreaterThan(0);
  });
});
