import { describe, it, expect } from "vitest";
import { workforceHireVsTrainOpsService } from "@/server/services/employer/workforceHireVsTrainOpsService";

describe("Workforce Hire vs Train Decision Optimization", () => {
  it("should evaluate cost savings and recommend hybrid hire-and-train strategies", async () => {
    const analysis = await workforceHireVsTrainOpsService.getHireVsTrainAnalysis();
    expect(analysis.roleTarget).toContain("EV Battery");
    expect(analysis.recommendationVerdict).toBe("HIRE_AND_TRAIN");
    expect(analysis.costSavingsPercentage).toBeGreaterThan(50);
    expect(analysis.trainingPartnerMatch.providerName).toContain("Government ITI Aundh");
  });
});
