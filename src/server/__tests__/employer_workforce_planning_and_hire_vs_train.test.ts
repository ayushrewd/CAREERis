import { describe, it, expect } from "vitest";
import { workforcePlanningService } from "@/server/services/employer/workforcePlanningService";
import { hireVsTrainDecisionEngine } from "@/server/services/employer/hireVsTrainDecisionEngine";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("Employer Intelligence: Workforce Planning & Decision Support", () => {
  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  it("retrieves workforce plans with role headcount targets", async () => {
    const plans = await workforcePlanningService.getPlans("comp-tata-motors");
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0].rolesTargeted.length).toBeGreaterThan(0);
    expect(plans[0].criticalSkillsNeeded.length).toBeGreaterThan(0);
  });

  it("evaluates explainable Hire vs Train decision analysis", async () => {
    const analysis = await hireVsTrainDecisionEngine.evaluateDecision({
      roleId: "role-bms-lead",
      roleTitle: "Battery Management System (BMS) Calibration Specialist",
      skillId: "skill-bms",
      headcountNeeded: 32,
      urgencyLevel: "URGENT",
    });

    expect(analysis).toBeDefined();
    expect(analysis.decisionRecommendation).toBe("PARTNER");
    expect(analysis.comparativeAnalysis.directHiringPros.length).toBeGreaterThan(0);
    expect(analysis.comparativeAnalysis.trainingPipelinePros.length).toBeGreaterThan(0);
    expect(analysis.availableTrainingPartners.length).toBeGreaterThan(0);
  });
});
