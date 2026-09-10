// ==============================================================================
// CAREERIS SCENARIO SIMULATION SERVICE
// Policy What-If Scenario Simulations & Multi-Scenario Comparisons (SIMULATION ONLY)
// ==============================================================================

import { PredictiveScenarioSimulation } from "@/types/predictiveIntelligence";
import { formatCurrencyINR } from "@/lib/utils";

export const scenarioSimulationService = {
  async runScenario(params: {
    scenarioName: string;
    targetScope: string;
    seatDeltaPercentage: number;
    labInvestmentINR?: number;
  }): Promise<PredictiveScenarioSimulation> {
    const baseSeats = 1200;
    const baseDemand = 3800;
    const newSeats = Math.round(baseSeats * (1 + params.seatDeltaPercentage / 100));
    const addlSeats = newSeats - baseSeats;
    const projectedPlacements = Math.round(newSeats * 0.88 * 0.84);
    const cost = params.labInvestmentINR || (addlSeats > 0 ? addlSeats * 28000 : 0);

    return {
      label: "SIMULATION ONLY",
      scenarioId: `sim-${Date.now().toString(36)}`,
      scenarioName: params.scenarioName || `Capacity Simulation (${params.seatDeltaPercentage > 0 ? "+" : ""}${params.seatDeltaPercentage}%)`,
      targetScope: params.targetScope || "Pune Automotive Cluster",
      assumptions: {
        seatDeltaPercentage: params.seatDeltaPercentage,
        completionRateAssumption: 0.88,
        placementConversionAssumption: 0.84,
      },
      baselineMetrics: {
        seats: baseSeats,
        supply: Math.round(baseSeats * 0.88),
        demand: baseDemand,
        placement: Math.round(baseSeats * 0.88 * 0.84),
      },
      projectedMetrics: {
        seats: newSeats,
        supply: Math.round(newSeats * 0.88),
        demandCoveragePercentage: Math.min(100, Math.round((newSeats / baseDemand) * 100)),
        placements: projectedPlacements,
      },
      deltaImpact: {
        seatsDelta: addlSeats,
        supplyDelta: Math.round(newSeats * 0.88) - Math.round(baseSeats * 0.88),
        placementsDelta: projectedPlacements - Math.round(baseSeats * 0.88 * 0.84),
        estimatedCostINR: cost,
      },
      riskSignals: [
        "Faculty hiring must precede batch launch by 6 weeks.",
        "High-voltage safety lab inspection required prior to enrollment.",
      ],
      generatedAt: new Date().toISOString(),
    };
  },

  async compareScenarios() {
    const baseline = await this.runScenario({ scenarioName: "Baseline Status Quo", targetScope: "Pune EV Hub", seatDeltaPercentage: 0 });
    const scenarioA = await this.runScenario({ scenarioName: "Scenario A: +25% Seat Expansion", targetScope: "Pune EV Hub", seatDeltaPercentage: 25 });
    const scenarioB = await this.runScenario({ scenarioName: "Scenario B: +50% Intensive Scaling", targetScope: "Pune EV Hub", seatDeltaPercentage: 50 });

    return {
      label: "SIMULATION ONLY",
      targetScope: "Pune Automotive Corridor",
      scenarios: [baseline, scenarioA, scenarioB],
      comparisonSummary: "Scenario A offers the optimal balance between seat intake (+300 seats) and trainer faculty readiness with ₹84L capex outlay.",
    };
  },
};
