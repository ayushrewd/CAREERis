import { describe, it, expect } from "vitest";
import { programmeRiskAndDecisionService } from "@/server/services/programme/programmeRiskAndDecisionService";

describe("Programme Risks & Four-Eyes Decision Approval", () => {
  it("should retrieve risk register and 5x5 heatmap risks", async () => {
    const risks = await programmeRiskAndDecisionService.getProgrammeRisks("prog-pmkvy-ev-01");
    expect(risks.length).toBeGreaterThan(0);
    expect(risks[0].riskScore).toBeLessThanOrEqual(25);
  });

  it("should enforce Four-Eyes Separation of Duties on approval", async () => {
    const decision = await programmeRiskAndDecisionService.proposeDecision({
      decisionType: "BUDGET_ALLOCATION",
      targetEntityId: "prog-pmkvy-ev-01",
      targetEntityName: "PMKVY 4.0 EV Mission Lab Tranche 3",
      requesterId: "user-gov-finance-01",
      requesterName: "Anil Joshi",
      requesterRole: "STATE_GOVERNMENT",
      reason: "Tranche 2 verified.",
      evidenceSummary: "Utilization certificates submitted.",
    });

    expect(decision.status).toBe("PROPOSED");

    // Self-approval by requester must be BLOCKED
    await expect(
      programmeRiskAndDecisionService.approveDecision({
        decisionId: decision.decisionId,
        approverId: "user-gov-finance-01", // Same as requester!
        approverName: "Anil Joshi",
        approverRole: "STATE_GOVERNMENT",
      })
    ).rejects.toThrow("Four-Eyes Violation");

    // Independent approver should SUCCEED
    const approved = await programmeRiskAndDecisionService.approveDecision({
      decisionId: decision.decisionId,
      approverId: "user-gov-dir-01", // Different user
      approverName: "Dr. Rajesh Kulkarni",
      approverRole: "NATIONAL_GOVERNMENT",
    });

    expect(approved.status).toBe("APPROVED");
    expect(approved.approverName).toBe("Dr. Rajesh Kulkarni");
  });
});
