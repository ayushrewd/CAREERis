import { describe, it, expect } from "vitest";
import { interventionManagementService } from "@/server/services/government/interventionManagementService";
import { governmentProgramService } from "@/server/services/government/governmentProgramService";
import { RequestAuthContext } from "@/server/middleware/authContext";

const mockAuth: RequestAuthContext = {
  userId: "admin-state-gov",
  userRole: "STATE_GOVERNMENT",
  fullName: "Principal Secretary Skill Development",
  email: "sec.skill@state.gov.in",
  assignedStateCode: "MH",
};

describe("Government Interventions & Program Management", () => {
  it("proposes and transitions intervention status through approval lifecycle", async () => {
    const created = await interventionManagementService.proposeIntervention(
      {
        title: "Test Sanand EV Technician Pilot",
        type: "SEAT_EXPANSION",
        description: "Add 100 EV assembly seats",
        problemStatement: "Shortage of EV technicians",
        rootSignal: "Requisitions up 40%",
        geographyScope: "DISTRICT",
        stateCode: "GJ",
        stateName: "Gujarat",
        districtId: "dist-ahmedabad",
        districtName: "Ahmedabad",
        responsibleAgency: "DET Gujarat",
        ownerOfficerName: "Test Officer",
        ownerOfficerEmail: "test@gujarat.gov.in",
        budgetINR: 10000000,
        startDate: "2026-03-01",
        targetCompletionDate: "2026-12-31",
        metricName: "Trainees",
        baselineValue: 20,
        targetValue: 100,
        confidenceScore: 0.92,
        evidenceSources: ["DET Portal"],
        riskSeverity: "LOW",
        status: "PROPOSED",
      },
      mockAuth
    );

    expect(created.status).toBe("PROPOSED");

    const approved = await interventionManagementService.updateInterventionStatus(
      created.id,
      "APPROVED",
      "Approved by State Steering Committee",
      undefined,
      mockAuth
    );
    expect(approved?.status).toBe("APPROVED");

    const funded = await interventionManagementService.updateInterventionStatus(
      created.id,
      "FUNDED",
      "Treasury released capital funds",
      undefined,
      mockAuth
    );
    expect(funded?.status).toBe("FUNDED");

    const completed = await interventionManagementService.updateInterventionStatus(
      created.id,
      "COMPLETED",
      "Training cohorts graduated",
      95,
      mockAuth
    );
    expect(completed?.status).toBe("COMPLETED");
    expect(completed?.actualValue).toBe(95);
    expect(completed?.achievementPercentage).toBe(95);
  });

  it("retrieves programs and updates program KPIs", async () => {
    const programs = await governmentProgramService.getPrograms();
    expect(programs.length).toBeGreaterThan(0);

    const pmkvy = programs.find((p) => p.schemeCode === "PMKVY_4");
    expect(pmkvy).toBeDefined();

    const updated = await governmentProgramService.updateProgramKPI(
      pmkvy!.id,
      pmkvy!.kpis[0].kpiId,
      78,
      "ON_TRACK",
      mockAuth
    );
    expect(updated?.kpis[0].currentValue).toBe(78);
  });
});
