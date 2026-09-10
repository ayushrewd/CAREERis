import { describe, it, expect } from "vitest";
import { modelRegistryService } from "@/server/services/intelligence/modelRegistryService";

describe("Forecast Model Registry, Drift Monitoring & Backtesting", () => {
  it("should track registered forecasting models with performance metrics", async () => {
    const models = await modelRegistryService.getAllModels();
    expect(models.length).toBeGreaterThanOrEqual(3);

    const active = models.filter((m) => m.status === "ACTIVE");
    expect(active.length).toBeGreaterThanOrEqual(2);
    expect(active[0].metrics.mapePercentage).toBeLessThan(10.0);
    expect(active[0].driftStatus).toBe("HEALTHY");
  });

  it("should provide backtesting validation logs against historical demand", async () => {
    const logs = await modelRegistryService.getBacktestReports();
    expect(logs.length).toBeGreaterThanOrEqual(2);
    expect(logs[0].passed).toBe(true);
    expect(Math.abs(logs[0].variancePercentage)).toBeLessThan(5.0);
  });
});
