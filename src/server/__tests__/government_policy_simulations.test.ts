import { describe, it, expect } from "vitest";
import { policyScenarioSimulatorService } from "@/server/services/government/policyScenarioSimulatorService";

describe("Policy Scenario Simulator & What-If Engine", () => {
  it("should evaluate multi-factor policy scenarios with projected skill gap reduction", async () => {
    const scenarios = await policyScenarioSimulatorService.getScenarios();
    expect(scenarios.length).toBeGreaterThanOrEqual(2);

    const seatScenario = scenarios[0];
    expect(seatScenario.scenarioType).toBe("SEAT_EXPANSION");
    expect(seatScenario.projectedSkillGapReductionPercentage).toBeGreaterThan(40);
    expect(seatScenario.riskAnalysis).toBeDefined();

    const trainerScenario = scenarios[1];
    expect(trainerScenario.scenarioType).toBe("TRAINER_RETRAINING");
    expect(trainerScenario.projectedSkillGapReductionPercentage).toBeGreaterThan(60);
  });

  it("should allow policy officers to simulate custom capacity expansions", async () => {
    const custom = await policyScenarioSimulatorService.simulateScenario({
      title: "Launch 500 Solar PV Seats in Sanand",
      scenarioType: "SEAT_EXPANSION",
      scopeGeography: "Sanand, Gujarat",
      baselineSeats: 2000,
      simulatedSeats: 2500,
      projectedSkillGapReductionPercentage: 55,
      estimatedCostINR: 35000000,
    });

    expect(custom.scenarioId).toBeDefined();
    expect(custom.confidenceScore).toBe(92);
  });
});
