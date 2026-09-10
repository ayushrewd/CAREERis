import { describe, it, expect } from "vitest";
import { programmeService } from "@/server/services/programme/programmeService";
import { programmeBudgetService } from "@/server/services/programme/programmeBudgetService";
import { interventionExecutionService } from "@/server/services/programme/interventionExecutionService";
import { beneficiaryAndOutcomeService } from "@/server/services/programme/beneficiaryAndOutcomeService";
import { programmeRiskAndDecisionService } from "@/server/services/programme/programmeRiskAndDecisionService";
import { programmeEvaluationService } from "@/server/services/programme/programmeEvaluationService";
import { executiveCommandCenterService } from "@/server/services/government/executiveCommandCenterService";

describe("Golden National Programme Operations & Impact Measurement Closed-Loop Journey", () => {
  it("should execute the full closed-loop national programme lifecycle from market signal to 365d retention evaluation", async () => {
    // 1. Programme Lifecycle & Theory of Change
    const programme = await programmeService.getProgrammeById("prog-pmkvy-ev-01");
    expect(programme).toBeDefined();
    expect(programme?.status).toBe("ACTIVE");
    expect(programme?.theoryOfChange.inputs.length).toBeGreaterThan(0);
    expect(programme?.theoryOfChange.outputs.length).toBeGreaterThan(0);
    expect(programme?.theoryOfChange.outcomes.length).toBeGreaterThan(0);

    // 2. Budget Intelligence & Multi-Tier Funding
    const budget = await programmeBudgetService.getBudgetByProgrammeId("prog-pmkvy-ev-01");
    expect(budget).toBeDefined();
    expect(budget?.allocatedAmountINR).toBe(425000000);
    expect(budget?.utilizedAmountINR).toBeGreaterThan(0);
    expect(budget?.costPerOutcome.costPerPlacedCandidateINR).toBeGreaterThan(0);
    expect(budget?.costPerOutcome.costPerRetainedCandidate365dINR).toBeGreaterThan(0);

    // 3. Four-Eyes Governed Decision Making
    const proposedDecision = await programmeRiskAndDecisionService.proposeDecision({
      decisionType: "BUDGET_ALLOCATION",
      targetEntityId: "prog-pmkvy-ev-01",
      targetEntityName: "PMKVY 4.0 EV Mission Lab Tranche 2",
      requesterId: "user-gov-finance-01",
      requesterName: "Anil Joshi",
      requesterRole: "STATE_GOVERNMENT",
      reason: "Tranche 1 milestones verified with 100% compliance.",
      evidenceSummary: "ARAI safety inspection sign-off and GeM utilization certificates submitted.",
    });
    expect(proposedDecision.status).toBe("PROPOSED");

    // Self-approval must be BLOCKED
    await expect(
      programmeRiskAndDecisionService.approveDecision({
        decisionId: proposedDecision.decisionId,
        approverId: "user-gov-finance-01",
        approverName: "Anil Joshi",
        approverRole: "STATE_GOVERNMENT",
      })
    ).rejects.toThrow("Four-Eyes Violation");

    // Independent approver succeeds
    const approvedDecision = await programmeRiskAndDecisionService.approveDecision({
      decisionId: proposedDecision.decisionId,
      approverId: "user-gov-dir-01",
      approverName: "Dr. Rajesh Kulkarni",
      approverRole: "NATIONAL_GOVERNMENT",
    });
    expect(approvedDecision.status).toBe("APPROVED");

    // 4. Intervention Milestone Execution
    const intervention = await interventionExecutionService.getInterventionById("int-ev-lab-chakan-01");
    expect(intervention).toBeDefined();
    expect(intervention?.explainability.compositePriorityScore).toBeGreaterThanOrEqual(90);
    expect(intervention?.milestones.length).toBeGreaterThanOrEqual(2);

    // 5. Beneficiary Funnel Progression & 365-Day Placement Retention
    const funnel = await beneficiaryAndOutcomeService.getBeneficiaryFunnel("prog-pmkvy-ev-01");
    expect(funnel).toBeDefined();
    expect(funnel?.placed).toBe(3620);
    expect(funnel?.retained365d).toBe(3236);
    expect(funnel?.retentionRate365dPercentage).toBe(89.4);
    expect(funnel?.placementQuality.roleRelevanceScore).toBe(94.2);

    // 6. Independent Impact Evaluation
    const evaluation = await programmeEvaluationService.getEvaluation("prog-pmkvy-ev-01");
    expect(evaluation).toBeDefined();
    expect(evaluation?.evaluationType).toBe("COHORT");
    expect(evaluation?.confidenceLevel).toBe(94);
    expect(evaluation?.postInterventionMetrics.placementRatePercentage).toBe(86.0);

    // 7. Executive Command Center 9-Answer Synthesis
    const commandCenterDigest = await executiveCommandCenterService.getExecutiveDigest();
    expect(commandCenterDigest.whatIsHappening).toBeDefined();
    expect(commandCenterDigest.isItWorking).toContain("Yes");
    expect(commandCenterDigest.howMuchDoesItCost).toContain("₹70.5 Cr");
    expect(commandCenterDigest.overall365dRetentionRatePercentage).toBe(89.4);
  });
});
