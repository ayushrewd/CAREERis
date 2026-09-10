import { describe, it, expect } from "vitest";
import { instituteOperatingService } from "@/server/services/training/instituteOperatingService";

describe("Institute Operating Service & 10-Dimension Scorecard", () => {
  it("should retrieve pan-India training institutes", async () => {
    const institutes = await instituteOperatingService.getAllInstitutes();
    expect(institutes.length).toBeGreaterThanOrEqual(4);
    expect(institutes.some((i) => i.stateCode === "MH")).toBe(true);
    expect(institutes.some((i) => i.stateCode === "KA")).toBe(true);
    expect(institutes.some((i) => i.stateCode === "TN")).toBe(true);
    expect(institutes.some((i) => i.stateCode === "GJ")).toBe(true);
  });

  it("should return an explainable 10-dimension scorecard with no hidden metrics", async () => {
    const scorecard = await instituteOperatingService.getInstituteScorecard("inst-iti-aundh-pune");
    expect(scorecard).toBeDefined();
    expect(scorecard?.overallHealthScore).toBeGreaterThanOrEqual(80);
    expect(scorecard?.componentScores.marketRelevance).toBeDefined();
    expect(scorecard?.componentScores.seatUtilization).toBeDefined();
    expect(scorecard?.componentScores.trainerAdequacy).toBeDefined();
    expect(scorecard?.componentScores.equipmentReadiness).toBeDefined();
    expect(scorecard?.componentScores.placementPerformance).toBeDefined();
    expect(scorecard?.whyIsThisScoreRanked.marketRelevance.explanation).toContain("Chakan");
  });
});
