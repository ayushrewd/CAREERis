import { describe, it, expect } from "vitest";
import { programmeBudgetService } from "@/server/services/programme/programmeBudgetService";

describe("Programme Budget Intelligence & Cost-Per-Outcome", () => {
  it("should calculate multi-source budget totals and burn rates", async () => {
    const summary = await programmeBudgetService.getBudgetSummary();
    expect(summary.totalAllocatedINR).toBeGreaterThan(0);
    expect(summary.overallUtilizationPercentage).toBeGreaterThan(0);

    const bgt = await programmeBudgetService.getBudgetByProgrammeId("prog-pmkvy-ev-01");
    expect(bgt).toBeDefined();
    expect(bgt?.fundingSources.length).toBeGreaterThanOrEqual(2);
    expect(bgt?.costPerOutcome.costPerPlacedCandidateINR).toBeGreaterThan(0);
    expect(bgt?.costPerOutcome.costPerRetainedCandidate365dINR).toBeGreaterThan(0);
  });
});
