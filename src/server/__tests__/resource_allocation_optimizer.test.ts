import { describe, it, expect } from "vitest";
import { resourceAllocationOptimizerService } from "@/server/services/programme/resourceAllocationOptimizerService";

describe("Resource Allocation Optimizer (Advisory Decision Support)", () => {
  it("should generate advisory-only resource distribution recommendations with clear disclaimers", () => {
    const result = resourceAllocationOptimizerService.optimizeBudgetDistribution({
      totalBudgetINR: 50000000,
      districts: ["dist-pune", "dist-aurangabad"],
      prioritySkills: ["skill-bms"],
    });

    expect(result.status).toBe("RECOMMENDED_ONLY_NOT_COMMITTED");
    expect(result.disclaimer).toContain("Advisory optimization only");
    expect(result.recommendations.length).toBe(2);
    expect(result.recommendations[0].recommendedFundingINR).toBe(25000000);
    expect(result.recommendations[0].expectedTraineeCapacity).toBeGreaterThan(0);
  });
});
