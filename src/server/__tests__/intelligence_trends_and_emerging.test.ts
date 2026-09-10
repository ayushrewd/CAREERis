import { describe, it, expect } from "vitest";
import { skillTrendService } from "@/server/services/intelligence/skillTrendService";
import { emergingSkillService } from "@/server/services/intelligence/emergingSkillService";
import { skillObservationService } from "@/server/services/intelligence/skillObservationService";

describe("Labour-Market Intelligence: Trends & Emerging Skills Engines", () => {
  it("should generate multi-quarter historical trend trajectories", async () => {
    const trend = await skillTrendService.getSkillTrend("skill-bms");
    expect(trend.historicalSeries.length).toBeGreaterThanOrEqual(4);
    expect(trend.growthRatePct).toBeGreaterThan(0);
    expect(trend.trendClassification).toBe("RISING");
    expect(trend.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("should calculate multi-factor explainable emerging skill scores", () => {
    const { score, breakdown } = emergingSkillService.calculateEmergingScore({
      growthRateYoY: 35.0,
      employersCount: 8,
      industriesCount: 3,
      districtsCount: 5,
      rolesCount: 3,
      trainingLagRatio: 4.5,
    });

    expect(score).toBeGreaterThanOrEqual(75);
    expect(score).toBeLessThanOrEqual(100);
    expect(breakdown.demandGrowthFactor).toBeGreaterThan(0);
    expect(breakdown.employerAdoptionFactor).toBeGreaterThan(0);
    expect(breakdown.crossIndustryFactor).toBeGreaterThan(0);
    expect(breakdown.trainingLagFactor).toBe(10);
  });

  it("should list verified emerging skills with explanation and training lag ratio", async () => {
    const emerging = await emergingSkillService.getEmergingSkills();
    expect(emerging.length).toBeGreaterThan(0);
    expect(emerging[0].emergingScore).toBeGreaterThanOrEqual(70);
    expect(emerging[0].explanation).toContain("derived from");
  });

  it("should track unmapped skill observations and surface emerging candidates", async () => {
    const obs = await skillObservationService.trackRawSkillTerm("Quantum Error Correction Middleware", "JOB_RADAR");
    expect(obs).toBeDefined();
    expect(obs.rawTerm).toBe("Quantum Error Correction Middleware");
    expect(obs.observationCount).toBeGreaterThanOrEqual(1);

    const candidates = await skillObservationService.getEmergingCandidates();
    expect(candidates.length).toBeGreaterThanOrEqual(1);
  });
});
