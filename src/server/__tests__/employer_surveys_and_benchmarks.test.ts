import { describe, it, expect } from "vitest";
import { employerFeedbackAndSurveyService } from "@/server/services/employer/employerFeedbackAndSurveyService";

describe("Employer Surveys, Post-Placement Feedback & Benchmarking", () => {
  it("should handle skill demand surveys and capture graduate satisfaction", async () => {
    const surveys = await employerFeedbackAndSurveyService.getSurveys("emp-tata-motors");
    expect(surveys.length).toBeGreaterThan(0);
    expect(surveys[0].satisfactionWithLocalGraduatesScore).toBeGreaterThanOrEqual(4.0);
    expect(surveys[0].topCriticalSkillsDemanded.length).toBeGreaterThan(0);

    const submitted = await employerFeedbackAndSurveyService.submitSurvey({
      employerId: "emp-tata-motors",
      respondentName: "Sanjay Deshmukh",
      satisfactionWithLocalGraduatesScore: 4.8,
    });
    expect(submitted.surveyId).toBeDefined();
  });

  it("should track post-placement feedback and retention milestones", async () => {
    const feedback = await employerFeedbackAndSurveyService.getPlacementFeedback("emp-tata-motors");
    expect(feedback.length).toBeGreaterThan(0);
    expect(feedback[0].technicalReadinessScore).toBe(5);
    expect(feedback[0].retentionMilestone).toBe("RETAINED_180D");
  });

  it("should retrieve anonymous regional industry benchmarks", async () => {
    const benchmarks = await employerFeedbackAndSurveyService.getIndustryBenchmarks("emp-tata-motors");
    expect(benchmarks.length).toBeGreaterThanOrEqual(3);
    expect(benchmarks[0].percentileRank).toBeGreaterThanOrEqual(90);
  });
});
