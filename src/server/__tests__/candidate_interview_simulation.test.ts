import { describe, it, expect } from "vitest";
import { interviewSimulationService } from "@/server/services/career/interviewSimulationService";

describe("Interview Simulation & Technical Scenarios", () => {
  it("should retrieve role-specific interview practice questions with scoring rubrics", async () => {
    const questions = await interviewSimulationService.getQuestions("EV Battery");
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].questionText).toContain("800V DC");
    expect(questions[0].expectedSkills).toContain("High-Voltage Safety Protocols");
    expect(questions[0].scoringRubric).toBeDefined();
  });
});
