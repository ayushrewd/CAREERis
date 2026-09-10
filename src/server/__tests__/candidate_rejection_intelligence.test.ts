import { describe, it, expect } from "vitest";
import { applicationIntelligenceService } from "@/server/services/career/applicationIntelligenceService";

describe("Application Intelligence & Rejection Pattern Diagnostics", () => {
  it("should explain application mismatch factors without subjective speculation", async () => {
    const diagnostics = await applicationIntelligenceService.getRejectionDiagnostics("cand-rohit-01");
    expect(diagnostics.length).toBeGreaterThan(0);
    expect(diagnostics[0].mismatchFactors.skillGapFactor).toBeDefined();
    expect(diagnostics[0].recommendedNextActions.length).toBeGreaterThan(0);
    expect(diagnostics[0].disclaimer).toBeDefined();
  });
});
