import { describe, it, expect } from "vitest";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { supplyAggregationService } from "@/server/services/intelligence/supplyAggregationService";
import { labourMarketGapService, calculateMarketTightness } from "@/server/services/intelligence/labourMarketGapService";
import { marketTightnessService } from "@/server/services/intelligence/marketTightnessService";

describe("Labour-Market Intelligence: Demand, Supply, Tightness & Gap Engines", () => {
  it("should aggregate demand across skills, industries, states, and districts without double counting", async () => {
    const summary = await demandAggregationService.aggregateDemand({});
    expect(summary.totalDemandVolume).toBeGreaterThan(5000);
    expect(summary.bySkill.length).toBeGreaterThan(0);
    expect(summary.byIndustry.length).toBeGreaterThan(0);
    expect(summary.byState.length).toBeGreaterThan(0);
    expect(summary.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("should retrieve distinct 6-tier supply levels without collapsing layers", async () => {
    const supply = await supplyAggregationService.getSupplyBySkill("skill-bms", { stateCode: "MH", districtId: "dist-mh-pun" });
    expect(supply.potentialSupply).toBeGreaterThan(supply.learningSupply);
    expect(supply.learningSupply).toBeGreaterThan(supply.certifiedSupply);
    expect(supply.certifiedSupply).toBeGreaterThan(supply.verifiedSkillSupply);
    expect(supply.verifiedSkillSupply).toBeGreaterThanOrEqual(supply.availableWorkforce);
  });

  it("should compute explainable net gap, deficit ratio, and qualitative tightness", async () => {
    const gap = await labourMarketGapService.calculateSkillGap("skill-bms", { stateCode: "MH", districtId: "dist-mh-pun" });
    expect(gap.netGap).toBeGreaterThan(0);
    expect(gap.gapRatio).toBeGreaterThan(2.0);
    expect(gap.marketTightness).toBe("VERY_TIGHT");
    expect(gap.primaryDrivers.length).toBeGreaterThan(0);
  });

  it("should correctly classify market tightness boundary thresholds", () => {
    expect(calculateMarketTightness(3000, 1000)).toBe("VERY_TIGHT"); // ratio 3.0 >= 2.5
    expect(calculateMarketTightness(2000, 1000)).toBe("TIGHT");      // ratio 2.0 >= 1.5
    expect(calculateMarketTightness(1000, 1000)).toBe("BALANCED");   // ratio 1.0 >= 0.8
    expect(calculateMarketTightness(500, 1000)).toBe("SURPLUS");     // ratio 0.5 < 0.8
  });

  it("should provide actionable guidance for tight market conditions", async () => {
    const tightness = await marketTightnessService.evaluateTightness("skill-bms");
    expect(tightness.tightness).toBe("VERY_TIGHT");
    expect(tightness.actionGuidance).toContain("seating expansion");
  });
});
