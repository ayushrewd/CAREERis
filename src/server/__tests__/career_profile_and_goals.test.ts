import { describe, it, expect } from "vitest";
import { candidateProfileService } from "@/server/services/career/candidateProfileService";
import { careerGoalService } from "@/server/services/career/careerGoalService";
import { careerTimelineService } from "@/server/services/career/careerTimelineService";

describe("Career Journey: Profile, Goals & Completeness", () => {
  it("calculates multi-section profile completeness score accurately", async () => {
    const completeness = await candidateProfileService.calculateCompleteness("cand-rohit-01");
    expect(completeness.overallPercentage).toBeGreaterThanOrEqual(70);
    expect(completeness.sections.basicInfo.isComplete).toBe(true);
    expect(completeness.sections.education.isComplete).toBe(true);
    expect(completeness.sections.skills.isComplete).toBe(true);
  });

  it("manages multiple simultaneous career goals with priority rankings", async () => {
    const goals = await careerGoalService.getGoals("cand-rohit-01");
    expect(goals.length).toBeGreaterThan(0);

    const primary = await careerGoalService.getPrimaryGoal("cand-rohit-01");
    expect(primary).not.toBeNull();
    expect(primary?.targetRoleTitle).toContain("Battery");

    // Add a secondary goal
    const newGoal = await careerGoalService.addGoal({
      candidateId: "cand-rohit-01",
      targetRoleId: "role-auto-specialist",
      targetRoleTitle: "Robotics Automation Engineer",
      targetIndustryId: "ind-ind-auto",
      targetIndustryName: "Robotics & Automation",
      targetGeography: {
        stateCode: "MH",
        districtName: "Pune",
      },
      targetSalaryRangeINR: { min: 800000, max: 1500000 },
      targetTimelineMonths: 12,
      priority: "SECONDARY",
    });

    expect(newGoal.id).toBeDefined();
    expect(newGoal.targetRoleTitle).toBe("Robotics Automation Engineer");

    // Remove the added goal to keep test clean
    const deleted = await careerGoalService.removeGoal(newGoal.id);
    expect(deleted).toBe(true);
  });

  it("records chronological milestones in the candidate career timeline", async () => {
    const timeline = await careerTimelineService.getTimeline("cand-rohit-01");
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline.some((e) => e.eventType === "EDUCATION_ENROLLED" || e.eventType === "SKILL_VERIFIED")).toBe(true);
  });
});
