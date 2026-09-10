import { describe, it, expect } from "vitest";
import { skillPredictionService } from "@/server/services/intelligence/skillPredictionService";

describe("Predictive Skill Intelligence, Adoption Curves & Obsolescence", () => {
  it("should evaluate emerging skill with acceleration stage and supply lag", async () => {
    const bms = await skillPredictionService.getSkillForecast("skill-bms");
    expect(bms).toBeDefined();
    expect(bms?.adoptionStage).toBe("ACCELERATION");
    expect(bms?.growthRatePercentage).toBeGreaterThan(100);
    expect(bms?.employerAdoptionVelocity).toBeGreaterThan(80);
    expect(bms?.trainingSupplyLagMonths).toBeGreaterThan(0);
    expect(bms?.adjacentSkills.length).toBeGreaterThan(0);
  });

  it("should detect skill obsolescence risk and recommend valid substitutes", async () => {
    const sub = await skillPredictionService.getSkillSubstitutionAnalysis("skill-manual-arc-weld");
    expect(sub).toBeDefined();
    expect(sub?.obsolescenceRisk).toBe("CRITICAL");
    expect(sub?.signals.length).toBeGreaterThan(0);
    expect(sub?.substitutes.length).toBeGreaterThan(0);
    expect(sub?.substitutes[0].similarityScore).toBeGreaterThanOrEqual(0.8);
  });

  it("should retrieve co-occurring future skill bundles with target roles", async () => {
    const bundles = await skillPredictionService.getFutureSkillBundles();
    expect(bundles.length).toBeGreaterThanOrEqual(2);
    expect(bundles[0].coOccurrenceScore).toBeGreaterThan(90);
    expect(bundles[0].targetRoles.length).toBeGreaterThan(0);
  });
});
