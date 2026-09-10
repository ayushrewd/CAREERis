import { describe, it, expect } from "vitest";
import { crossIndustryAnalysisService } from "@/server/services/intelligence/crossIndustryAnalysisService";
import { crossGeographyAnalysisService } from "@/server/services/intelligence/crossGeographyAnalysisService";
import { curriculumAlignmentService } from "@/server/services/intelligence/curriculumAlignmentService";
import { intelligenceComparisonService } from "@/server/services/intelligence/intelligenceComparisonService";
import { intelligenceAlertService } from "@/server/services/intelligence/intelligenceAlertService";
import { geographyRepository } from "@/server/repositories/geographyRepository";

describe("Labour-Market Intelligence: Cross-Analysis, Pan-India Coverage & Comparisons", () => {
  it("should evaluate cross-industry technology diffusion", async () => {
    const diffusion = await crossIndustryAnalysisService.getSkillIndustryDiffusion("skill-py");
    expect(diffusion.industryDistribution.length).toBeGreaterThanOrEqual(3);
    expect(diffusion.diversityIndex).toBeGreaterThan(0.5);
  });

  it("should verify pan-India multi-state geographic distribution", async () => {
    const geo = await crossGeographyAnalysisService.getSkillGeographicDistribution("skill-bms");
    expect(geo.topStates.length).toBeGreaterThanOrEqual(4);
    expect(geo.topDistricts.length).toBeGreaterThanOrEqual(4);
    expect(geo.fastestGrowingDistricts.length).toBeGreaterThanOrEqual(3);

    // Verify pan-India zones in geography repository
    const allStates = await geographyRepository.findAllStates();
    expect(allStates.length).toBeGreaterThanOrEqual(7);
    expect(allStates.some((s) => s.code === "MH")).toBe(true); // West
    expect(allStates.some((s) => s.code === "KA")).toBe(true); // South
    expect(allStates.some((s) => s.code === "TN")).toBe(true); // South
    expect(allStates.some((s) => s.code === "GJ")).toBe(true); // West
    expect(allStates.some((s) => s.code === "UP")).toBe(true); // North
    expect(allStates.some((s) => s.code === "AS")).toBe(true); // North-East
  });

  it("should generate vocational curriculum alignment recommendations", async () => {
    const alignments = await curriculumAlignmentService.getCurriculumAlignments("Pune");
    expect(alignments.length).toBeGreaterThan(0);
    expect(alignments[0].alignmentScore).toBeGreaterThan(80);
    expect(alignments[0].recommendedAction).toBeDefined();
    expect(alignments[0].rationale.length).toBeGreaterThan(10);
  });

  it("should perform normalized skill vs skill comparison", async () => {
    const comp = await intelligenceComparisonService.compareEntities({
      type: "SKILL_VS_SKILL",
      idA: "skill-bms",
      idB: "skill-plc",
    });

    expect(comp.comparisonType).toBe("SKILL_VS_SKILL");
    expect(comp.entityA.metrics.annualDemand).toBeGreaterThan(0);
    expect(comp.entityB.metrics.annualDemand).toBeGreaterThan(0);
    expect(comp.deltaSummary).toContain("annual demand");
  });

  it("should retrieve active policy alerts", async () => {
    const alerts = await intelligenceAlertService.getActiveAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some((a) => a.severity === "CRITICAL")).toBe(true);
  });
});
