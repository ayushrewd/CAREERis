import { describe, it, expect } from "vitest";
import { workforceIntelligenceService } from "@/server/services/employer/workforceIntelligenceService";

describe("Workforce Planning, Forecasting & Scenarios", () => {
  it("should retrieve multi-horizon workforce demand projections", async () => {
    const forecasts = await workforceIntelligenceService.getWorkforceForecasts("emp-tata-motors");
    expect(forecasts.length).toBeGreaterThanOrEqual(3);
    expect(forecasts[0].horizonMonths).toBe(3);
    expect(forecasts[0].netHeadcountGap).toBeGreaterThan(0);
    expect(forecasts[0].criticalSkillGaps.length).toBeGreaterThan(0);
  });

  it("should evaluate strategic workforce scenarios with risk assessments", async () => {
    const scenarios = await workforceIntelligenceService.getWorkforceScenarios("emp-tata-motors");
    expect(scenarios.length).toBeGreaterThanOrEqual(2);
    expect(scenarios[0].strategy).toBe("HIRE_DIRECT");
    expect(scenarios[1].strategy).toBe("INTERNAL_RESKILL");
    expect(scenarios[1].riskAssessment).toBe("LOW");
    expect(scenarios[1].disclaimer).toBeDefined();
  });
});
