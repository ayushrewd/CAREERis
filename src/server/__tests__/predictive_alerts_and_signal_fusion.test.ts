import { describe, it, expect } from "vitest";
import { predictiveRiskAlertService } from "@/server/services/intelligence/predictiveRiskAlertService";

describe("Predictive Early Warning System & Signal Fusion", () => {
  it("should retrieve early warning alerts with signal fusion and empirical evidence", async () => {
    const alerts = await predictiveRiskAlertService.getAllAlerts();
    expect(alerts.length).toBeGreaterThanOrEqual(3);

    const crit = alerts.find((a) => a.severity === "CRITICAL");
    expect(crit).toBeDefined();
    expect(crit?.signalFusionStatus).toBe("CONSISTENT");
    expect(crit?.evidenceData).toBeDefined();
    expect(crit?.recommendedIntervention).toBeDefined();
  });

  it("should explain forecast drivers transparently with citations", async () => {
    const exp = await predictiveRiskAlertService.explainForecastDriver("skill-bms");
    expect(exp.whyThisIsHappening.length).toBeGreaterThan(0);
    expect(exp.evidenceSources.length).toBeGreaterThan(0);
    expect(exp.confidenceScore).toBeGreaterThanOrEqual(0.9);
  });
});
