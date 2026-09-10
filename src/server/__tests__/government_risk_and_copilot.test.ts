import { describe, it, expect } from "vitest";
import { districtRiskService } from "@/server/services/government/districtRiskService";
import { policyCopilotService } from "@/server/services/government/policyCopilotService";

describe("District Risk Engine & Grounded AI Policy Copilot", () => {
  it("detects 9-dimension district risk signals and early warning alerts", async () => {
    const risks = await districtRiskService.getDistrictRisks();
    expect(risks.length).toBeGreaterThan(0);

    const alerts = await districtRiskService.getEarlyWarningAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].alertType).toBeDefined();
  });

  it("answers policy queries with grounded labeling (FACT / ANALYSIS / SIMULATION)", async () => {
    const res1 = await policyCopilotService.ask({
      userRole: "NATIONAL_GOVERNMENT",
      userScope: { scopeType: "NATIONAL" },
      query: "What are the largest skill shortages nationally?",
    });

    expect(res1.groundingLabel).toBe("FACT");
    expect(res1.answer).toContain("Battery Management Systems (BMS)");
    expect(res1.groundingData.sourcesUsed.length).toBeGreaterThan(0);

    const res2 = await policyCopilotService.ask({
      userRole: "DISTRICT_ADMIN",
      userScope: { scopeType: "DISTRICT", stateCode: "MH", districtId: "dist-pune" },
      query: "What happens if we simulate +30% seats in Pune?",
    });

    expect(res2.groundingLabel).toBe("SIMULATION");
    expect(res2.answer).toContain("Simulation Result");
  });
});
