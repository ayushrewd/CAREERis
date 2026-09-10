import { describe, it, expect } from "vitest";
import { careerComparisonAndSimulationService } from "@/server/services/career/careerComparisonAndSimulationService";

describe("Career Discovery, Comparison & Path Simulation", () => {
  it("should compare multiple career paths with skill gaps and demand indices", async () => {
    const comparison = await careerComparisonAndSimulationService.compareCareers();
    expect(comparison.roles.length).toBeGreaterThanOrEqual(3);
    expect(comparison.roles[0].overallMatchScore).toBe(88);
    expect(comparison.summaryRecommendation).toContain("EV Battery System Diagnostic Specialist");
  });

  it("should generate a sequential step-by-step career path simulation", async () => {
    const simulation = await careerComparisonAndSimulationService.simulateCareerPath({
      candidateId: "cand-rohit-01",
      targetRoleId: "role-bms-specialist",
    });

    expect(simulation.steps.length).toBeGreaterThanOrEqual(5);
    expect(simulation.steps[0].isAlreadyMet).toBe(true);
    expect(simulation.steps[1].isAlreadyMet).toBe(false);
    expect(simulation.confidenceScore).toBe(94);
    expect(simulation.disclaimer).toContain("Does not guarantee employment");
  });
});
