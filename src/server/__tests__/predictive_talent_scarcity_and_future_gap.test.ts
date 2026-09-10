import { describe, it, expect } from "vitest";
import { employerTalentScarcityService } from "@/server/services/intelligence/employerTalentScarcityService";

describe("Employer Talent Scarcity & Supply-Demand Future Gaps", () => {
  it("should project employer talent scarcity with hiring difficulty and wage premiums", async () => {
    const list = await employerTalentScarcityService.getTalentScarcityOverview({ districtName: "Pune" });
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].hiringDifficultyIndex).toBeGreaterThan(80);
    expect(list[0].netProjectedDeficit).toBeGreaterThan(10000);
    expect(list[0].scarceSkills[0].wageInflationPremiumYoY).toBeGreaterThan(20);
  });

  it("should model multi-tier future supply-demand gap across pipeline stages", async () => {
    const gap = await employerTalentScarcityService.getFutureSupplyDemandGap("skill-bms");
    expect(gap).toBeDefined();
    expect(gap.forecast12MDemand).toBeGreaterThan(30000);
    expect(gap.forecast12MSupplyTiers.learningInInstitutes).toBeGreaterThan(0);
    expect(gap.forecast12MSupplyTiers.skillPassportVerified).toBeGreaterThan(0);
    expect(gap.projectedNetGap).toBeGreaterThan(0);
    expect(gap.gapSeverity).toBe("CRITICAL_DEFICIT");
  });
});
