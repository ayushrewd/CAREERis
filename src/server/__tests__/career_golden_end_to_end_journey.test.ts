import { describe, it, expect } from "vitest";
import { candidateProfileService } from "@/server/services/career/candidateProfileService";
import { careerGoalService } from "@/server/services/career/careerGoalService";
import { careerReadinessService } from "@/server/services/career/careerReadinessService";
import { skillPrioritizationService } from "@/server/services/career/skillPrioritizationService";
import { personalizedLearningService } from "@/server/services/career/personalizedLearningService";
import { projectRecommendationService } from "@/server/services/career/projectRecommendationService";
import { personalizedJobService } from "@/server/services/career/personalizedJobService";
import { applicationService } from "@/server/services/applicationService";
import { careerTimelineService } from "@/server/services/career/careerTimelineService";
import { careerProgressService } from "@/server/services/career/careerProgressService";
import { careerAnalyticsService } from "@/server/services/career/careerAnalyticsService";
import { careerCopilotService } from "@/server/services/career/careerCopilotService";

describe("CareerIS Master Prompt 06: Golden End-to-End Career Journey Chain", () => {
  it("executes the entire 18-stage career execution chain from profile to placement and intelligence update", async () => {
    const candidateId = "cand-golden-01";

    // 1. Candidate Profile & Completeness
    const profile = await candidateProfileService.getProfile(candidateId);
    expect(profile).toBeDefined();
    expect(profile.currentDistrict).toBe("Pune");

    const completeness = await candidateProfileService.calculateCompleteness(candidateId);
    expect(completeness.overallPercentage).toBeGreaterThanOrEqual(70);

    // 2. Career Goal Definition
    const goal = await careerGoalService.addGoal({
      candidateId,
      targetRoleId: "role-bms-lead",
      targetRoleTitle: "Battery Management System (BMS) Calibration Specialist",
      targetIndustryId: "ind-auto-ev",
      targetIndustryName: "Automotive & Electric Mobility",
      targetGeography: { stateCode: "MH", districtName: "Pune" },
      targetSalaryRangeINR: { min: 750000, max: 1400000 },
      targetTimelineMonths: 6,
      priority: "PRIMARY",
    });
    expect(goal).not.toBeNull();
    const targetRoleId = goal.targetRoleId;
    expect(targetRoleId).toBe("role-bms-lead");

    // 3. Current Skills & Evidence Audit
    expect(profile.skills.length).toBeGreaterThanOrEqual(2);
    const verifiedSkills = profile.skills.filter((s) => s.verificationStatus === "VERIFIED");
    expect(verifiedSkills.length).toBeGreaterThanOrEqual(2);

    // 4. Target Role & Readiness Diagnostics
    const readiness = await careerReadinessService.evaluateReadiness(candidateId, targetRoleId);
    expect(readiness.overallReadinessScore).toBeGreaterThanOrEqual(80);
    expect(readiness.readinessLevel).toBe("HIGHLY_READY");

    // 5. Skill Gap Identification & Prioritization
    const prioritizedSkills = await skillPrioritizationService.getPrioritizedSkills(candidateId, targetRoleId);
    expect(prioritizedSkills.length).toBeGreaterThan(0);
    expect(prioritizedSkills[0].priorityRank).toBe(1);

    // 6. Personalized Learning Path Milestones
    const learningPath = await personalizedLearningService.generatePersonalizedPath(candidateId, targetRoleId);
    expect(learningPath.milestones.length).toBeGreaterThanOrEqual(4);
    expect(learningPath.milestones[0].stage).toBe("TARGET_ROLE");

    // 7. Hands-on Capstone Project Submission
    const projects = await projectRecommendationService.getRecommendedProjects(candidateId, targetRoleId);
    expect(projects.length).toBeGreaterThan(0);

    const targetProject = projects[0];
    const projectSubmission = await projectRecommendationService.submitProjectEvidence(
      targetProject.id,
      "https://careeris.gov.in/evidence/golden-journey-bms-harness.csv",
      candidateId
    );
    expect(projectSubmission?.isCompleted).toBe(true);

    // 8. Personalized Job Discovery & Explainable Match
    const jobs = await personalizedJobService.getRecommendedJobs(candidateId);
    expect(jobs.length).toBeGreaterThan(0);
    const targetJob = jobs.find((j) => !j.isApplied) || jobs[jobs.length - 1];
    expect(targetJob).toBeDefined();
    expect(targetJob.whyYouMatch.length).toBeGreaterThan(0);

    // 9. Application Execution
    const application = await applicationService.applyForJob({
      candidateId,
      jobId: targetJob.jobId,
      coverLetter: "Submitting verified ASDC Level 5 Skill Passport for BMS Specialist vacancy.",
    });
    expect(application).toBeDefined();
    expect(application.stage).toBe("APPLIED");

    // 10. Application Lifecycle Progress (Shortlisted -> Interview -> Offered)
    const shortlisted = await applicationService.updateApplicationStage(application.id, "SHORTLISTED");
    expect(shortlisted.stage).toBe("SHORTLISTED");

    const interviewed = await applicationService.updateApplicationStage(application.id, "INTERVIEW_SCHEDULED");
    expect(interviewed.stage).toBe("INTERVIEW_SCHEDULED");

    const offered = await applicationService.updateApplicationStage(application.id, "OFFERED");
    expect(offered.stage).toBe("OFFERED");

    // 11. Career Timeline Milestone Logging
    await careerTimelineService.recordMilestone({
      candidateId: profile.id,
      eventType: "OFFER_RECEIVED",
      title: `Offer Received from ${targetJob.companyName}`,
      description: `Formal employment offer extended for ${targetJob.jobTitle}.`,
      entityId: application.id,
      eventDate: new Date().toISOString().split("T")[0],
    });

    const timeline = await careerTimelineService.getTimeline(profile.id);
    expect(timeline.some((e) => e.eventType === "OFFER_RECEIVED")).toBe(true);

    // 12. Application Analytics & Funnel Diagnostics
    const analytics = await careerAnalyticsService.getApplicationAnalytics(candidateId);
    expect(analytics.totalApplications).toBeGreaterThan(0);
    expect(analytics.conversionRates.viewRatePct).toBeGreaterThan(0);

    // 13. Career Progress Velocity
    const progress = await careerProgressService.getCareerProgress(candidateId);
    expect(progress.currentReadinessScore).toBeGreaterThanOrEqual(progress.startingReadinessScore);
    expect(progress.progressVelocityPct).toBeGreaterThan(0);

    // 14. Grounded AI Copilot Querying
    const copilotAnswer = await careerCopilotService.chat({
      candidateId,
      message: "Which jobs match my verified credentials?",
    });
    expect(copilotAnswer.isGroundedInDeterministicData).toBe(true);
    expect(copilotAnswer.supportingData.matchingJobsCount).toBeGreaterThan(0);
  });
});
