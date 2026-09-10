import { describe, it, expect } from "vitest";
import { talentPoolService } from "@/server/services/employer/talentPoolService";
import { workforceIntelligenceService } from "@/server/services/employer/workforceIntelligenceService";
import { reskillingAndTrainingService } from "@/server/services/employer/reskillingAndTrainingService";
import { employerFeedbackAndSurveyService } from "@/server/services/employer/employerFeedbackAndSurveyService";
import { employerAdvisorService } from "@/server/services/employer/employerAdvisorService";

describe("Golden Employer Talent Intelligence & Hiring Operating System Journey", () => {
  it("should execute the complete employer lifecycle from talent pool discovery to 365-day retention feedback", async () => {
    const employerId = "emp-tata-motors";

    // 1. Talent Pool Discovery & Verified Matching
    const pools = await talentPoolService.getTalentPools(employerId);
    expect(pools.length).toBeGreaterThan(0);
    const evPool = pools[0];
    expect(evPool.candidateCount).toBe(48);
    expect(evPool.candidateIds).toContain("cand-rohit-01");

    // 2. Workforce Forecasting
    const forecasts = await workforceIntelligenceService.getWorkforceForecasts(employerId);
    expect(forecasts.length).toBeGreaterThanOrEqual(3);
    const sixMonthForecast = forecasts[1];
    expect(sixMonthForecast.horizonMonths).toBe(6);
    expect(sixMonthForecast.netHeadcountGap).toBe(82);

    // 3. Scenario Simulation (Hire vs Internal Reskill)
    const scenarios = await workforceIntelligenceService.getWorkforceScenarios(employerId);
    expect(scenarios.length).toBeGreaterThanOrEqual(2);
    const reskillScenario = scenarios[1];
    expect(reskillScenario.strategy).toBe("INTERNAL_RESKILL");
    expect(reskillScenario.estimatedCostINR).toBeLessThan(scenarios[0].estimatedCostINR);

    // 4. Reskilling Pathway & Training Partner Connection
    const pathways = await reskillingAndTrainingService.getReskillingPathways(employerId);
    expect(pathways.length).toBeGreaterThan(0);
    expect(pathways[0].trainingProviderName).toContain("ITI Aundh");

    const partners = await reskillingAndTrainingService.getTrainingPartners();
    expect(partners.length).toBeGreaterThan(0);
    expect(partners[0].isNcvdAccredited).toBe(true);

    // 5. Post-Placement Feedback & Retention Loop
    const feedbackList = await employerFeedbackAndSurveyService.getPlacementFeedback(employerId);
    expect(feedbackList.length).toBeGreaterThan(0);
    expect(feedbackList[0].candidateId).toBe("cand-rohit-01");
    expect(feedbackList[0].technicalReadinessScore).toBe(5);
    expect(feedbackList[0].retentionMilestone).toBe("RETAINED_180D");

    // 6. Grounded Employer AI Copilot
    const advisorResponse = await employerAdvisorService.askAdvisor({
      employerId,
      query: "How does our hiring velocity compare to the automotive sector benchmark?",
    });
    expect(advisorResponse.answerText).toContain("22 days");
    expect(advisorResponse.confidenceScore).toBeGreaterThanOrEqual(90);

    // 7. Industry Anonymous Benchmarks
    const benchmarks = await employerFeedbackAndSurveyService.getIndustryBenchmarks(employerId);
    expect(benchmarks.length).toBeGreaterThanOrEqual(3);
    expect(benchmarks[2].metricName).toContain("Retention");
    expect(benchmarks[2].employerValue).toBe(89.4);
  });
});
