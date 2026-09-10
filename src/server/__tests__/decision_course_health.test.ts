import { describe, it, expect } from "vitest";
import { courseHealthService } from "@/server/services/intelligence/decision/courseHealthService";
import { courseObsolescenceService } from "@/server/services/intelligence/decision/courseObsolescenceService";
import { courseOversupplyService } from "@/server/services/intelligence/decision/courseOversupplyService";
import { skillOversupplyService } from "@/server/services/intelligence/decision/skillOversupplyService";

describe("Decision Intelligence: Course Health, Obsolescence & Oversupply", () => {
  it("evaluates explainable 7-dimension course health profile for EV Battery Systems", async () => {
    const health = await courseHealthService.evaluateCourseHealth("course-bms-01");

    expect(health.courseId).toBe("course-bms-01");
    expect(health.overallScore).toBeGreaterThanOrEqual(80);
    expect(health.classification).toBe("EXCELLENT");
    expect(health.components.marketDemandAlignment).toBeGreaterThan(70);
    expect(health.components.skillAlignment).toBeGreaterThan(80);
    expect(health.components.placementPerformance).toBeGreaterThan(80);
    expect(health.components.curriculumFreshness).toBeGreaterThan(80);
    expect(health.weightVersion).toBe("1.2.0");
    expect(health.confidence).toBe(0.95);
  });

  it("detects Critical Obsolescence Risk on outdated legacy manual trade", async () => {
    const obs = await courseObsolescenceService.evaluateObsolescence("course-legacy-draft-01");

    expect(obs.riskLevel).toBe("CRITICAL");
    expect(obs.riskScore).toBeGreaterThan(80);
    expect(obs.signals.demandDeclineRateYoY).toBeLessThan(0);
    expect(obs.signals.placementRate).toBeLessThan(40);
    expect(obs.signals.technologySubstitutionRisk).toBe(true);
    expect(obs.recommendedReviewAction).toBe("GOVERNANCE_REVIEW_REQUIRED");
    expect(obs.evidence.length).toBeGreaterThan(0);
  });

  it("evaluates course oversupply ratio and classification", async () => {
    const oversupply = await courseOversupplyService.evaluateCourseOversupply("course-bms-01");

    expect(oversupply.courseId).toBe("course-bms-01");
    expect(oversupply.annualSeats).toBe(35);
    expect(oversupply.classification).toBe("BALANCED");
    expect(oversupply.oversupplyRatio).toBeLessThan(1.0);
  });

  it("evaluates skill oversupply keeping 6 distinct supply tiers separate", async () => {
    const res = await skillOversupplyService.evaluateSkillOversupply("skill-bms", "MH");

    expect(res.skillId).toBe("skill-bms");
    expect(res.potentialSupply).toBeDefined();
    expect(res.learningSupply).toBeDefined();
    expect(res.certifiedSupply).toBeDefined();
    expect(res.verifiedSupply).toBeDefined();
    expect(res.availableSupply).toBeDefined();
    expect(res.placedSupply).toBeDefined();
    expect(res.totalDemand).toBeGreaterThan(0);
  });
});
