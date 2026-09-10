import { describe, it, expect } from "vitest";
import { recruitmentPipelineService } from "@/server/services/employer/recruitmentPipelineService";
import { interviewWorkflowService } from "@/server/services/employer/interviewWorkflowService";
import { offerManagementService } from "@/server/services/employer/offerManagementService";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("Employer Intelligence: Pipeline, Interviews & Offers", () => {
  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  it("manages candidate pipeline transitions and bulk actions", async () => {
    const bulkResult = await recruitmentPipelineService.executeBulkAction({
      applicationIds: ["app-rohit-tm-01"],
      actionType: "SHORTLIST",
      payload: { note: "Verified ASDC Level 5 badge holder" },
      auth: employerAuth,
    });

    expect(bulkResult.successfulCount).toBe(1);
    expect(bulkResult.failedCount).toBe(0);
  });

  it("schedules interview and submits diagnostic evaluation rubric", async () => {
    const interview = await interviewWorkflowService.scheduleInterview(
      {
        applicationId: "app-rohit-tm-01",
        requisitionId: "req-tm-bms-01",
        candidateId: "cand-rohit-01",
        candidateName: "Rohit Sharma",
        jobTitle: "BMS Calibration Specialist",
        roundNumber: 1,
        roundName: "Technical Systems Diagnostic",
        format: "TECHNICAL_PANEL",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        locationOrMeetingLink: "Chakan Plant Building C",
        interviewerId: "user-employer-tm-02",
        interviewerName: "Deepa Menon",
      },
      employerAuth
    );

    expect(interview).toBeDefined();
    expect(interview.status).toBe("SCHEDULED");

    const evaluated = await interviewWorkflowService.submitFeedback(
      interview.id,
      {
        overallScore: 5,
        recommendation: "STRONG_HIRE",
        evaluations: [
          { criteriaName: "TECHNICAL_SKILL", score: 5, feedbackComment: "Exceptional CAN bus debugging skills" },
        ],
        summaryComments: "Passed test bench evaluation with distinction.",
        assessedSkills: [
          { skillId: "skill-bms", skillName: "Battery Management Systems", assessedProficiency: "ADVANCED" },
        ],
        submittedAt: new Date().toISOString(),
        submittedBy: "Deepa Menon",
      },
      employerAuth
    );

    expect(evaluated).not.toBeNull();
    expect(evaluated!.status).toBe("COMPLETED");
    expect(evaluated!.feedback?.recommendation).toBe("STRONG_HIRE");
  });
});
