import { describe, it, expect } from "vitest";
import { nationalPolicyIntelligenceService } from "@/server/services/government/nationalPolicyIntelligenceService";

describe("Government National Skill Intelligence & Risk Register", () => {
  it("should retrieve aggregated pan-India labour intelligence metrics", async () => {
    const data = await nationalPolicyIntelligenceService.getNationalIntelligence();
    expect(data.totalActiveNationalDemand).toBeGreaterThan(4000000);
    expect(data.totalVerifiedCandidateSupply).toBeGreaterThan(3000000);
    expect(data.netNationalSkillGap).toBeGreaterThan(1000000);
    expect(data.topDemandedSkillsPanIndia.length).toBeGreaterThanOrEqual(4);
  });

  it("should retrieve and create early warning capacity alerts", async () => {
    const alerts = await nationalPolicyIntelligenceService.getCriticalAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].severity).toBe("CRITICAL");

    const created = await nationalPolicyIntelligenceService.createGovernmentAlert({
      severity: "HIGH",
      title: "Solar Inverter Technician Deficit in Sanand",
      description: "Demand spike +45%",
      state: "Gujarat",
      district: "Ahmedabad",
    });

    expect(created.alertId).toBeDefined();
  });
});
