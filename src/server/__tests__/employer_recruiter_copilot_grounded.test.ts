import { describe, it, expect } from "vitest";
import { groundedRecruiterCopilotService } from "@/server/services/employer/groundedRecruiterCopilotService";

describe("Grounded AI Recruiter Copilot Service", () => {
  it("should answer candidate discovery questions citing verified skill credentials and requisitions", async () => {
    const response = await groundedRecruiterCopilotService.askRecruiterCopilot({
      employerId: "emp-tata-motors",
      query: "Find candidates for EV Battery Specialist",
    });

    expect(response.answerText).toContain("Rohit Sharma");
    expect(response.candidateRecommendations.length).toBeGreaterThan(0);
    expect(response.evidenceCited.length).toBeGreaterThan(0);
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it("should provide cost-optimized advice for hire vs train queries", async () => {
    const response = await groundedRecruiterCopilotService.askRecruiterCopilot({
      employerId: "emp-tata-motors",
      query: "Should we train or hire 50 technicians?",
    });

    expect(response.answerText).toContain("HYBRID");
    expect(response.answerText).toContain("57.3%");
    expect(response.confidenceScore).toBeGreaterThanOrEqual(90);
  });
});
