import { describe, it, expect } from "vitest";
import { governmentCommandCenterService } from "@/server/services/government/governmentCommandCenterService";
import { stateIntelligenceService } from "@/server/services/government/stateIntelligenceService";
import { districtMatrixService } from "@/server/services/government/districtMatrixService";
import { districtActionCenterService } from "@/server/services/government/districtActionCenterService";
import { interventionManagementService } from "@/server/services/government/interventionManagementService";
import { budgetIntelligenceService } from "@/server/services/government/budgetIntelligenceService";
import { RequestAuthContext } from "@/server/middleware/authContext";

const mockAuth: RequestAuthContext = {
  userId: "admin-nat-gov",
  userRole: "NATIONAL_GOVERNMENT",
  fullName: "Joint Secretary MSDE",
  email: "js.msde@nic.in",
};

describe("Golden Government Journey — Full Closed-Loop Pan-India Decision Intelligence", () => {
  it("executes the complete government decision-support lifecycle", async () => {
    // 1. National Command Center: Inspect 10 Core Cards & Aggregate KPIs
    const nationalOverview = await governmentCommandCenterService.getNationalCommandOverview(mockAuth);
    expect(nationalOverview.tenCoreCards).toHaveLength(10);
    expect(nationalOverview.kpis.criticalSkillShortagesCount).toBeGreaterThan(0);

    // 2. Geographic Drill-down: Explore Maharashtra State
    const mhDossier = await stateIntelligenceService.getStateFullDossier("MH");
    expect(mhDossier?.state.stateCode).toBe("MH");
    expect(mhDossier?.state.annualEmployerDemand).toBe(420000);

    // 3. District Matrix & Priority: Discover Pune is Critical Deficit (Score: 89)
    const puneMatrixRow = (await districtMatrixService.getDistrictSkillMatrix({ stateCode: "MH" })).find(
      (r) => r.districtId === "dist-pune"
    );
    expect(puneMatrixRow?.priorityCategory).toBe("CRITICAL");
    expect(puneMatrixRow?.skills["skill-bms"]?.netGap).toBeGreaterThan(3000);

    // 4. District Action Center: Answer 'What Should Pune Do Next?'
    const actionDossier = await districtActionCenterService.getDistrictActionDossier("dist-pune");
    expect(actionDossier.whatShouldThisDistrictDoNext.length).toBeGreaterThanOrEqual(3);
    const topAction = actionDossier.whatShouldThisDistrictDoNext[0];
    expect(topAction.targetSkill).toContain("Battery Management Systems (BMS)");

    // 5. Propose & Fund Intervention
    const intervention = await interventionManagementService.proposeIntervention(
      {
        title: "Golden Journey Pune BMS CoE Expansion",
        type: "COE_PARTNERSHIP",
        description: topAction.actionTitle,
        problemStatement: "Acute BMS deficit",
        rootSignal: topAction.evidence,
        geographyScope: "DISTRICT",
        stateCode: "MH",
        stateName: "Maharashtra",
        districtId: "dist-pune",
        districtName: "Pune",
        responsibleAgency: "DVET Maharashtra",
        ownerOfficerName: "Vikram Deshmukh",
        ownerOfficerEmail: "v.deshmukh@dvet.gov.in",
        budgetINR: topAction.estimatedBudgetINR,
        startDate: "2026-03-01",
        targetCompletionDate: "2027-02-28",
        metricName: "Certified Technicians",
        baselineValue: 60,
        targetValue: 300,
        confidenceScore: 0.95,
        evidenceSources: ["DVET Annual Filings", "Tata Motors Requisition Feed"],
        riskSeverity: "LOW",
        status: "PROPOSED",
      },
      mockAuth
    );
    expect(intervention.status).toBe("PROPOSED");

    // Approve and Fund
    await interventionManagementService.updateInterventionStatus(
      intervention.id,
      "APPROVED",
      "Cabinet Committee approval",
      undefined,
      mockAuth
    );
    await interventionManagementService.updateInterventionStatus(
      intervention.id,
      "FUNDED",
      "Capital allocation released",
      undefined,
      mockAuth
    );
    const inProgress = await interventionManagementService.updateInterventionStatus(
      intervention.id,
      "IN_PROGRESS",
      "Lab construction commenced",
      undefined,
      mockAuth
    );
    expect(inProgress?.status).toBe("IN_PROGRESS");

    // 6. Complete & Evaluate Outcome
    const evaluated = await interventionManagementService.updateInterventionStatus(
      intervention.id,
      "EVALUATED",
      "First 240 apprentices placed in Tata Motors & Bajaj Auto Chakan plants",
      285,
      mockAuth
    );
    expect(evaluated?.status).toBe("EVALUATED");
    expect(evaluated?.actualValue).toBe(285);
    expect(evaluated?.achievementPercentage).toBe(95);

    // 7. Verify Budget ROI Efficiency
    const budgetAnalysis = await budgetIntelligenceService.getBudgetOutcomeAnalysis();
    expect(budgetAnalysis.costPerPlacementINR).toBeLessThan(25000);
    expect(budgetAnalysis.placementOutcomeRatePercentage).toBeGreaterThan(60);
  });
});
