import { describe, it, expect } from "vitest";
import { budgetIntelligenceService } from "@/server/services/government/budgetIntelligenceService";
import { whatIfScenarioSimulator } from "@/server/services/government/whatIfScenarioSimulator";

describe("Government Budget Intelligence & Scenario Simulator", () => {
  it("calculates cost-per-placement and outcome efficiency metrics", async () => {
    const analysis = await budgetIntelligenceService.getBudgetOutcomeAnalysis();
    expect(analysis).toBeDefined();
    expect(analysis.totalBudgetSpentINR).toBeGreaterThan(100000000);
    expect(analysis.costPerPlacementINR).toBeGreaterThan(5000);
    expect(analysis.costPerPlacementINR).toBeLessThan(50000);
  });

  it("runs What-If simulation with explicit SIMULATION label", async () => {
    const simulation = await whatIfScenarioSimulator.runSimulation({
      scenarioTitle: "Test +20% BMS Seats Simulation",
      geographyScope: "DISTRICT",
      stateCode: "MH",
      targetSkillId: "skill-bms",
      adjustments: {
        trainingSeatCapacityDeltaPercent: 20,
        employerCoEApprenticeshipCreated: true,
      },
    });

    expect(simulation.label).toBe("SIMULATION");
    expect(simulation.disclaimer).toContain("NOT AN ACTUAL GUARANTEED OUTCOME");
    expect(simulation.projected.supply).toBeGreaterThan(simulation.baseline.supply);
    expect(simulation.projected.netGap).toBeLessThan(simulation.baseline.netGap);
  });
});
