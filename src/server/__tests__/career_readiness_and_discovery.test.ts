import { describe, it, expect } from "vitest";
import { careerReadinessService } from "@/server/services/career/careerReadinessService";
import { careerDiscoveryService } from "@/server/services/career/careerDiscoveryService";
import { careerTransitionService } from "@/server/services/career/careerTransitionService";

describe("Career Journey: Readiness, Discovery & Transitions", () => {
  it("evaluates 7-factor explainable readiness score and gap items", async () => {
    const readiness = await careerReadinessService.evaluateReadiness("cand-rohit-01", "role-bms-lead");
    expect(readiness.overallReadinessScore).toBeGreaterThanOrEqual(80);
    expect(readiness.readinessLevel).toBe("HIGHLY_READY");
    expect(readiness.factors.skillCoverage.score).toBeGreaterThan(0);
    expect(readiness.factors.evidenceStrength.score).toBeGreaterThan(0);
    expect(readiness.gapItems.length).toBeGreaterThan(0);
  });

  it("classifies career discovery opportunities with explainable rationale", async () => {
    const recs = await careerDiscoveryService.discoverCareers("cand-rohit-01");
    expect(recs.length).toBeGreaterThan(0);

    const topFit = recs[0];
    expect(topFit.fitScore).toBeGreaterThan(0);
    expect(topFit.topMatchingSkills.length).toBeGreaterThan(0);
    expect(["BEST_FIT", "STRONG_FIT", "ADJACENT_CAREER", "CAREER_TRANSITION", "EMERGING_OPPORTUNITY"]).toContain(topFit.fitClassification);
  });

  it("computes transferable skills and transition reskilling path for career pivots", async () => {
    const transition = await careerTransitionService.analyzeTransition("cand-trans-03", "role-bms-lead");
    expect(transition.toRoleTitle).toContain("Battery");
    expect(transition.projectedReadinessScore).toBeGreaterThan(0);
    expect(transition.recommendedCourses.length).toBeGreaterThan(0);
    expect(transition.relevantEmployers.length).toBeGreaterThan(0);
  });
});
