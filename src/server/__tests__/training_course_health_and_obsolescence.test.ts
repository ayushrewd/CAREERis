import { describe, it, expect } from "vitest";
import { courseHealthIntelligenceService } from "@/server/services/training/courseHealthIntelligenceService";

describe("Course Health, Obsolescence & Oversupply Intelligence", () => {
  it("should evaluate high-demand course health and recommend EXPAND", async () => {
    const health = await courseHealthIntelligenceService.evaluateCourseHealth("course-bms-lead-01");
    expect(health).toBeDefined();
    expect(health.healthScore).toBeGreaterThanOrEqual(85);
    expect(health.classification).toBe("EXCELLENT");
    expect(health.recommendedAction).toBe("EXPAND");
    expect(health.obsolescenceRisk.level).toBe("LOW_RISK");
  });

  it("should detect legacy trade obsolescence and recommend MODERNIZE without auto-retiring", async () => {
    const health = await courseHealthIntelligenceService.evaluateCourseHealth("course-legacy-welder-01");
    expect(health).toBeDefined();
    expect(health.healthScore).toBeLessThan(60);
    expect(health.obsolescenceRisk.level).toBe("CRITICAL_RISK");
    expect(health.recommendedAction).toBe("MODERNIZE");
    expect(health.obsolescenceRisk.isCandidateForRetirement).toBe(false);
  });
});
