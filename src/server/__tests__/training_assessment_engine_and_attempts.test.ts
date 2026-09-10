import { describe, it, expect } from "vitest";
import { assessmentEngineService } from "@/server/services/training/assessmentEngineService";

describe("Assessment Engine, Question Bank & Verifiable Scoring", () => {
  it("should retrieve questions mapped to canonical skills", async () => {
    const questions = await assessmentEngineService.getQuestions();
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].skillName).toBeDefined();
    expect(questions[0].scoringRubric).toBeDefined();
  });

  it("should record assessment attempts and evaluate skill breakdowns", async () => {
    const attempt = await assessmentEngineService.submitAttempt({
      assessmentId: "assess-asdc-bms-2026",
      candidateId: "cand-rohit-01",
      candidateName: "Rohit Sharma",
      scorePercentage: 94,
      skillLevelBreakdown: [
        { skillName: "High-Voltage Safety Protocols", score: 98, isVerified: true },
        { skillName: "Battery Management Systems (BMS)", score: 92, isVerified: true },
      ],
    });

    expect(attempt.attemptId).toBeDefined();
    expect(attempt.scorePercentage).toBe(94);
    expect(attempt.status).toBe("VERIFIED");
    expect(attempt.skillLevelBreakdown[0].isVerified).toBe(true);
  });
});
