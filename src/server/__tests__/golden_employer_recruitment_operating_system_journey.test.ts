import { describe, it, expect } from "vitest";
import { skillFirstRequisitionService } from "@/server/services/employer/skillFirstRequisitionService";
import { talentMatchingAndTrainabilityService } from "@/server/services/employer/talentMatchingAndTrainabilityService";
import { recruitmentPipelineOpsService } from "@/server/services/employer/recruitmentPipelineOpsService";
import { workforceHireVsTrainOpsService } from "@/server/services/employer/workforceHireVsTrainOpsService";
import { groundedRecruiterCopilotService } from "@/server/services/employer/groundedRecruiterCopilotService";

describe("Golden Employer Recruitment Operating System Closed-Loop Journey", () => {
  it("should execute the complete employer lifecycle from requisition to candidate matching, pipeline advancement, and hire-vs-train analysis", async () => {
    // 1. Requisition Verification
    const reqs = await skillFirstRequisitionService.getRequisitions("emp-tata-motors");
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    const requisition = reqs[0];
    expect(requisition.skills.length).toBeGreaterThanOrEqual(3);

    // 2. Candidate Matching & Trainability
    const matches = await talentMatchingAndTrainabilityService.getMatchingCandidates(requisition.requisitionId);
    expect(matches.length).toBeGreaterThanOrEqual(2);
    const topCandidate = matches[0];
    expect(topCandidate.candidateName).toBe("Rohit Sharma");
    expect(topCandidate.classification).toBe("STRONG_MATCH");

    // 3. Recruiter Copilot Consultation
    const copilotAnswer = await groundedRecruiterCopilotService.askRecruiterCopilot({
      employerId: "emp-tata-motors",
      query: "Who is the top candidate for the EV battery requisition?",
    });
    expect(copilotAnswer.answerText).toContain("Rohit Sharma");
    expect(copilotAnswer.confidenceScore).toBeGreaterThanOrEqual(90);

    // 4. Recruitment Pipeline Advancement
    const pipeline = await recruitmentPipelineOpsService.getPipelineApplications(requisition.requisitionId);
    expect(pipeline.length).toBeGreaterThanOrEqual(1);
    const app = pipeline[0];

    const advancedApp = await recruitmentPipelineOpsService.advanceStage(
      app.applicationId,
      "HIRED",
      "Candidate accepted offer of INR 6.5L CTC. Onboarding scheduled."
    );
    expect(advancedApp?.currentStage).toBe("HIRED");

    // 5. Workforce Hire vs Train Strategy Evaluation
    const hireVsTrain = await workforceHireVsTrainOpsService.getHireVsTrainAnalysis();
    expect(hireVsTrain.recommendationVerdict).toBe("HIRE_AND_TRAIN");
    expect(hireVsTrain.costSavingsPercentage).toBeGreaterThan(50);
  });
});
