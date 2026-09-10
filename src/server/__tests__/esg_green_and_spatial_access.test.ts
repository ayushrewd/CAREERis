import { describe, it, expect } from "vitest";
import { esgAndGreenIntelligenceService } from "@/server/services/government/esgAndGreenIntelligenceService";

describe("ESG & Green Skills Transformation", () => {
  it("should retrieve ESG summary indicators and green placement metrics", async () => {
    const esg = await esgAndGreenIntelligenceService.getESGSummary();
    expect(esg.greenSkillsDemandIndex).toBeGreaterThan(70);
    expect(esg.greenTrainingCapacityTotal).toBeGreaterThan(0);
    expect(esg.greenJobPlacementsCount).toBeGreaterThan(0);
    expect(esg.governanceComplianceScore).toBeGreaterThanOrEqual(95);
  });
});
