import { describe, it, expect } from "vitest";
import { policyPriorityService } from "@/server/services/government/policyPriorityService";
import { districtRiskService } from "@/server/services/government/districtRiskService";
import { whatIfScenarioSimulator } from "@/server/services/government/whatIfScenarioSimulator";
import { interventionManagementService } from "@/server/services/government/interventionManagementService";
import { policyCopilotService } from "@/server/services/government/policyCopilotService";
import { RequestAuthContext } from "@/server/middleware/authContext";

const mockAuth: RequestAuthContext = {
  userId: "admin-policy-analyst",
  userRole: "POLICY_ANALYST",
  fullName: "Senior Labour Market Policy Analyst",
  email: "analyst@msde.gov.in",
};

describe("Golden Policy Journey — Trend → Alert → Recommendation → Scenario → Intervention → Impact", () => {
  it("orchestrates an evidence-grounded policy response to an emerging skill crisis", async () => {
    // 1. Policy Copilot grounded consultation: Identify top national skill shortage
    const copilotQuery = await policyCopilotService.ask({
      userRole: "POLICY_ANALYST",
      userScope: { scopeType: "NATIONAL" },
      query: "What are the largest skill shortages nationally?",
    });
    expect(copilotQuery.groundingLabel).toBe("FACT");
    expect(copilotQuery.answer).toContain("Battery Management Systems (BMS)");

    // 2. Early Warning Alert: Detect +68% demand spike in Pune
    const alerts = await districtRiskService.getEarlyWarningAlerts({ stateCode: "MH" });
    const puneAlert = alerts.find((a) => a.districtName === "Pune");
    expect(puneAlert).toBeDefined();
    expect(puneAlert?.changePercentage).toBe(68);

    // 3. Evidence-Grounded Policy Recommendations
    const recommendations = await policyPriorityService.getPolicyRecommendations({ stateCode: "MH", districtName: "Pune" });
    expect(recommendations.length).toBeGreaterThan(0);
    const rec = recommendations[0];
    expect(rec.options.length).toBeGreaterThanOrEqual(2);
    expect(rec.options[0].optionName).toContain("Sponsored CoE");

    // 4. What-If Scenario Simulation: Model adding +30% capacity + OEM CoE
    const simulation = await whatIfScenarioSimulator.runSimulation({
      scenarioTitle: "Policy Brief Scenario: +30% BMS Seats with Tata Motors CoE",
      geographyScope: "DISTRICT",
      stateCode: "MH",
      targetSkillId: "skill-bms",
      adjustments: {
        trainingSeatCapacityDeltaPercent: 30,
        employerCoEApprenticeshipCreated: true,
      },
    });
    expect(simulation.label).toBe("SIMULATION");
    expect(simulation.projected.placementRate).toBeGreaterThanOrEqual(85);
    expect(simulation.projected.netGap).toBeLessThan(simulation.baseline.netGap);

    // 5. Compare Scenarios: Choose highest ROI intervention
    const comparison = await whatIfScenarioSimulator.compareScenarios([simulation.scenarioId]);
    expect(comparison.scenarios.length).toBeGreaterThan(0);
    expect(comparison.comparativeInsight).toBeDefined();

    // 6. Propose Intervention with Human Approval Requirement
    const intervention = await interventionManagementService.proposeIntervention(
      {
        title: "Policy Journey: Chakan BMS Apprenticeship Scheme",
        type: "COE_PARTNERSHIP",
        description: "60/40 Government-Industry Sponsored CoE at ITI Aundh",
        problemStatement: rec.problem,
        rootSignal: rec.rootSignal,
        geographyScope: "DISTRICT",
        stateCode: "MH",
        stateName: "Maharashtra",
        districtId: "dist-pune",
        districtName: "Pune",
        responsibleAgency: "DVET Maharashtra",
        ownerOfficerName: "Vikram Deshmukh",
        ownerOfficerEmail: "v.deshmukh@dvet.gov.in",
        budgetINR: 35000000,
        startDate: "2026-04-01",
        targetCompletionDate: "2027-03-31",
        metricName: "Certified BMS Technicians",
        baselineValue: 60,
        targetValue: 300,
        confidenceScore: 0.96,
        evidenceSources: rec.sources,
        riskSeverity: "LOW",
        status: "PROPOSED",
      },
      mockAuth
    );
    expect(intervention.status).toBe("PROPOSED");
    expect(intervention.riskSeverity).toBe("LOW");
  });
});
