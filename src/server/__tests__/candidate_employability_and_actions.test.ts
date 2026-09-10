import { describe, it, expect } from "vitest";
import { candidateEmployabilityService } from "@/server/services/career/candidateEmployabilityService";

describe("Candidate Employability Scorecard & Next-Best-Actions", () => {
  it("should calculate multi-factor readiness and return actionable next steps", async () => {
    const scorecard = await candidateEmployabilityService.getScorecard("cand-rohit-01");
    expect(scorecard.overallReadinessScore).toBe(84);
    expect(scorecard.readinessLevel).toBe("MODERATELY_READY");
    expect(scorecard.components.skillCoverage).toBeGreaterThanOrEqual(80);
    expect(scorecard.nextBestActions.length).toBeGreaterThanOrEqual(3);
  });

  it("should toggle next-best-action completion status", async () => {
    const updated = await candidateEmployabilityService.toggleAction("act-01", true);
    expect(updated).toBeDefined();
    expect(updated?.isCompleted).toBe(true);
  });
});
