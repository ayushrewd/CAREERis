import { describe, it, expect } from "vitest";
import { schemeIntelligenceService } from "@/server/services/government/schemeIntelligenceService";

describe("Government Skill Schemes & Coverage Gap Intelligence", () => {
  it("should retrieve government schemes with fund utilization and placement metrics", async () => {
    const schemes = await schemeIntelligenceService.getSchemes();
    expect(schemes.length).toBeGreaterThanOrEqual(3);

    const pmkvy = schemes.find((s) => s.schemeCode === "PMKVY_4_SPECIAL");
    expect(pmkvy).toBeDefined();
    expect(pmkvy?.allocatedBudgetINR).toBe(1200000000);
    expect(pmkvy?.placementRatePercentage).toBeGreaterThan(80);

    const gapScheme = schemes.find((s) => s.policyCoverageStatus === "POLICY_COVERAGE_GAP");
    expect(gapScheme).toBeDefined();
    expect(gapScheme?.gapExplanation).toBeDefined();
  });
});
