import { describe, it, expect } from "vitest";
import { scenarioSimulationService } from "@/server/services/intelligence/scenarioSimulationService";

describe("What-If Policy Scenario Engine (SIMULATION ONLY)", () => {
  it("should simulate training capacity expansion with SIMULATION ONLY label", async () => {
    const sim = await scenarioSimulationService.runScenario({
      scenarioName: "EV Training Expansion",
      targetScope: "Pune EV Hub",
      seatDeltaPercentage: 25,
    });

    expect(sim).toBeDefined();
    expect(sim.label).toBe("SIMULATION ONLY");
    expect(sim.deltaImpact.seatsDelta).toBeGreaterThan(0);
    expect(sim.deltaImpact.placementsDelta).toBeGreaterThan(0);
    expect(sim.projectedMetrics.demandCoveragePercentage).toBeGreaterThan(0);
    expect(sim.riskSignals.length).toBeGreaterThan(0);
  });

  it("should compare multiple scenarios against baseline", async () => {
    const comp = await scenarioSimulationService.compareScenarios();
    expect(comp.label).toBe("SIMULATION ONLY");
    expect(comp.scenarios.length).toBe(3);
    expect(comp.comparisonSummary).toBeDefined();
  });
});
