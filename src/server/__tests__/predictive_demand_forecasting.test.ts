import { describe, it, expect } from "vitest";
import { demandForecastService } from "@/server/services/intelligence/demandForecastService";

describe("National & Regional Labour-Market Demand Forecasting Engine", () => {
  it("should retrieve national 12-month labour demand forecast with confidence bounds", async () => {
    const national = await demandForecastService.getNationalDemandForecast();
    expect(national).toBeDefined();
    expect(national.scope).toBe("NATIONAL");
    expect(national.currentDemand).toBeGreaterThan(2000000);
    expect(national.forecastDemand).toBeGreaterThan(national.currentDemand);
    expect(national.percentageChange).toBeGreaterThan(0);
    expect(national.confidenceScore).toBeGreaterThanOrEqual(0.85);
    expect(national.projections.length).toBeGreaterThanOrEqual(4);

    // Verify confidence interval bounds
    const p1 = national.projections[0];
    expect(p1.lowerConfidenceBound).toBeLessThanOrEqual(p1.projectedDemand);
    expect(p1.upperConfidenceBound).toBeGreaterThanOrEqual(p1.projectedDemand);
  });

  it("should retrieve regional cluster forecasts preserving geographic scope", async () => {
    const list = await demandForecastService.getForecasts({ scope: "DISTRICT" });
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].scope).toBe("DISTRICT");
    expect(list[0].scopeEntityName).toContain("Pune");
  });
});
