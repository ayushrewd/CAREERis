import { describe, it, expect } from "vitest";
import { recruitmentPipelineOpsService } from "@/server/services/employer/recruitmentPipelineOpsService";

describe("Employer Recruitment Pipeline & 7-Stage ATS Workflow", () => {
  it("should retrieve applications and allow advancing candidate stages with recruiter notes", async () => {
    const pipeline = await recruitmentPipelineOpsService.getPipelineApplications("req-tata-ev-01");
    expect(pipeline.length).toBeGreaterThanOrEqual(1);

    const app = pipeline[0];
    expect(app.candidateName).toBe("Rohit Sharma");
    expect(app.interviewScorecard?.verdict).toBe("RECOMMEND_HIRE");

    const advanced = await recruitmentPipelineOpsService.advanceStage(
      app.applicationId,
      "OFFERED",
      "Offer extended with INR 6.5L CTC."
    );
    expect(advanced).toBeDefined();
    expect(advanced?.currentStage).toBe("OFFERED");
  });
});
