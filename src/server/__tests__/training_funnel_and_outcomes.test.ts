import { describe, it, expect } from "vitest";
import { trainingFunnelService } from "@/server/services/training/trainingFunnelService";

describe("Training Funnel, Drop-off Analysis & Market Fit Intelligence", () => {
  it("should retrieve the 9-stage vocational funnel", async () => {
    const stages = await trainingFunnelService.getFunnelStages();
    expect(stages.length).toBe(9);
    expect(stages[0].stageName).toBe("INTERESTED");
    expect(stages[8].stageName).toBe("PLACED");
    expect(stages[8].volume).toBeGreaterThan(0);
  });

  it("should perform drop-off leakage root-cause analysis", async () => {
    const dropOff = await trainingFunnelService.getDropOffAnalysis();
    expect(dropOff).toBeDefined();
    expect(dropOff.totalInterested).toBeGreaterThan(1000000);
    expect(dropOff.totalPlaced).toBeGreaterThan(400000);
    expect(dropOff.majorLeakageStages.length).toBeGreaterThanOrEqual(2);
  });

  it("should compute Course Market Fit scores across portfolio", async () => {
    const fitScores = await trainingFunnelService.getAllMarketFitScores();
    expect(fitScores.length).toBeGreaterThanOrEqual(3);
    const bms = fitScores.find((f) => f.courseId === "course-bms-lead-01");
    expect(bms?.overallFitScore).toBeGreaterThanOrEqual(90);
    expect(bms?.portfolioClassification).toBe("EXPAND");
  });
});
