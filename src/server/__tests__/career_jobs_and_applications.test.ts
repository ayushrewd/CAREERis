import { describe, it, expect } from "vitest";
import { personalizedJobService } from "@/server/services/career/personalizedJobService";
import { jobMatchSimulationService } from "@/server/services/career/jobMatchSimulationService";
import { careerAnalyticsService } from "@/server/services/career/careerAnalyticsService";

describe("Career Journey: Personalized Jobs, Match Simulation & Analytics", () => {
  it("generates explainable job recommendations with why you match & gap diagnoses", async () => {
    const jobs = await personalizedJobService.getRecommendedJobs("cand-rohit-01");
    expect(jobs.length).toBeGreaterThan(0);

    const topJob = jobs[0];
    expect(topJob.matchScore).toBeGreaterThanOrEqual(70);
    expect(topJob.whyYouMatch.length).toBeGreaterThan(0);
    expect(topJob.matchedSkills.length).toBeGreaterThan(0);
  });

  it("simulates match score improvement when a candidate acquires a missing skill", async () => {
    const simulation = await jobMatchSimulationService.simulateSkillAddition(
      "job-01",
      "skill-ros",
      "ADVANCED",
      "cand-rohit-01"
    );

    expect(simulation.label).toBe("SIMULATION");
    expect(simulation.currentMatchScore).toBeGreaterThan(0);
    expect(simulation.projectedMatchScore).toBeGreaterThanOrEqual(simulation.currentMatchScore);
    expect(simulation.caveat).toContain("SIMULATION ONLY");
  });

  it("aggregates 7-stage application funnel conversion rates and diagnostic factors", async () => {
    const analytics = await careerAnalyticsService.getApplicationAnalytics("cand-rohit-01");
    expect(analytics.totalApplications).toBeGreaterThan(0);
    expect(analytics.conversionRates.viewRatePct).toBeGreaterThan(0);
    expect(analytics.possibleContributingFactors.length).toBeGreaterThan(0);
  });
});
