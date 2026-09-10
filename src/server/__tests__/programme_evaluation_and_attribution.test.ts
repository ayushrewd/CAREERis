import { describe, it, expect } from "vitest";
import { programmeEvaluationService } from "@/server/services/programme/programmeEvaluationService";

describe("Outcome Evaluation & Attribution Methodology", () => {
  it("should retrieve rigorous evaluation reports and verify causality disclaimers", async () => {
    const evaluation = await programmeEvaluationService.getEvaluation("prog-pmkvy-ev-01");
    expect(evaluation).toBeDefined();
    expect(evaluation?.evaluationType).toBe("COHORT");
    expect(evaluation?.confidenceLevel).toBeGreaterThanOrEqual(90);
    expect(evaluation?.causalityDisclaimer).toBeDefined();
    expect(evaluation?.keyRecommendations.length).toBeGreaterThan(0);
  });
});
