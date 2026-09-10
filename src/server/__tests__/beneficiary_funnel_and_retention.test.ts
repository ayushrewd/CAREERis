import { describe, it, expect } from "vitest";
import { beneficiaryAndOutcomeService } from "@/server/services/programme/beneficiaryAndOutcomeService";

describe("Beneficiary Funnel & Multi-Horizon Retention", () => {
  it("should verify beneficiary funnel progression and 365-day EPFO retention", async () => {
    const funnel = await beneficiaryAndOutcomeService.getBeneficiaryFunnel("prog-pmkvy-ev-01");
    expect(funnel).toBeDefined();
    expect(funnel?.enrolled).toBeGreaterThan(funnel?.certified || 0);
    expect(funnel?.certified).toBeGreaterThan(funnel?.placed || 0);
    expect(funnel?.placed).toBeGreaterThan(funnel?.retained365d || 0);
    expect(funnel?.retentionRate365dPercentage).toBeGreaterThan(80);
    expect(funnel?.placementQuality.roleRelevanceScore).toBeGreaterThan(90);

    const nationalSummary = await beneficiaryAndOutcomeService.getNationalOutcomeSummary();
    expect(nationalSummary.totalEnrolled).toBeGreaterThan(0);
    expect(nationalSummary.averagePlacementRatePercentage).toBeGreaterThan(70);
  });
});
