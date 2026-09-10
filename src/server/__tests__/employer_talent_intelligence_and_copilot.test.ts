import { describe, it, expect } from "vitest";
import { talentIntelligenceService } from "@/server/services/employer/talentIntelligenceService";
import { talentForecastService } from "@/server/services/employer/talentForecastService";
import { recruitmentCopilotService } from "@/server/services/employer/recruitmentCopilotService";

describe("Employer Intelligence: Talent Availability & AI Copilot", () => {
  it("retrieves regional talent availability radar across clusters", async () => {
    const mapItems = await talentIntelligenceService.getTalentAvailabilityMap();
    expect(mapItems.length).toBeGreaterThan(0);
    const chakanCluster = mapItems.find((i) => i.geographyCode === "cluster-chakan");
    expect(chakanCluster).toBeDefined();
    expect(chakanCluster!.verifiedSkillHolders).toBeGreaterThan(0);
  });

  it("calculates Hiring Difficulty Index with explainable justification", async () => {
    const diff = await talentIntelligenceService.calculateHiringDifficulty({
      skillId: "skill-bms",
      district: "Pune",
    });

    expect(diff).toBeDefined();
    expect(diff.difficultyCategory).toBe("VERY_HIGH");
    expect(diff.demandSupplyRatio).toBeGreaterThan(3.0);
    expect(diff.mitigationStrategy.length).toBeGreaterThan(0);
  });

  it("generates 12-month talent pipeline forecast with mandatory FORECAST labeling", async () => {
    const forecast = await talentForecastService.getTalentForecast({
      skillId: "skill-bms",
      stateCode: "MH",
    });

    expect(forecast.label).toBe("FORECAST");
    expect(forecast.disclaimer).toContain("NOT A GUARANTEE");
    expect(forecast.expectedGraduatesNextQuarter).toBeGreaterThan(0);
    expect(forecast.institutionalSupplyPipelines.length).toBeGreaterThan(0);
  });

  it("answers employer talent queries with grounded deterministic AI Copilot", async () => {
    const res = await recruitmentCopilotService.ask({
      employerId: "comp-tata-motors",
      query: "Which candidates best match our BMS vacancy?",
    });

    expect(res.groundingLabel).toBe("FACT");
    expect(res.answer).toContain("Rohit Sharma");
    expect(res.suggestedFollowUpActions.length).toBeGreaterThan(0);
  });
});
