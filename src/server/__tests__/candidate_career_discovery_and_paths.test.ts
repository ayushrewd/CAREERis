import { describe, it, expect } from "vitest";
import { nationalCareerGuidanceService } from "@/server/services/career/nationalCareerGuidanceService";

describe("Candidate Career Discovery & Fit Scoring", () => {
  it("should retrieve personalized career discoveries with explainable match reasons", async () => {
    const discoveries = await nationalCareerGuidanceService.getCareerDiscoveries("cand-rohit-01");
    expect(discoveries.length).toBeGreaterThanOrEqual(3);

    const topDiscovery = discoveries[0];
    expect(topDiscovery.roleTitle).toContain("EV Battery System Calibration");
    expect(topDiscovery.fitScore).toBeGreaterThanOrEqual(80);
    expect(topDiscovery.whyItFitsExplanation.length).toBeGreaterThan(0);
    expect(topDiscovery.salaryRangeINR.min).toBeGreaterThan(0);
  });
});
