import { describe, it, expect } from "vitest";
import { systemHealthService } from "@/server/services/security/systemHealthService";

describe("System Health & Observability Monitoring", () => {
  it("should monitor infrastructure components and calculate overall health", async () => {
    const health = await systemHealthService.getSystemHealth();
    expect(health.length).toBeGreaterThanOrEqual(5);

    const summary = await systemHealthService.getOverallSystemStatus();
    expect(summary.status).toBe("HEALTHY");
    expect(summary.healthyServices).toBeGreaterThanOrEqual(4);
  });
});
