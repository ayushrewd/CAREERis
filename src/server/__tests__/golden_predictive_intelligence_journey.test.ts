import { describe, it, expect } from "vitest";
import { demandForecastService } from "@/server/services/intelligence/demandForecastService";
import { skillPredictionService } from "@/server/services/intelligence/skillPredictionService";
import { roleForecastService } from "@/server/services/intelligence/roleForecastService";
import { careerTrajectoryService } from "@/server/services/career/careerTrajectoryService";
import { employerTalentScarcityService } from "@/server/services/intelligence/employerTalentScarcityService";
import { curriculumFutureFitService } from "@/server/services/intelligence/curriculumFutureFitService";
import { scenarioSimulationService } from "@/server/services/intelligence/scenarioSimulationService";
import { predictiveRiskAlertService } from "@/server/services/intelligence/predictiveRiskAlertService";
import { modelRegistryService } from "@/server/services/intelligence/modelRegistryService";
import { careerisCopilotService } from "@/server/services/intelligence/careerisCopilotService";

describe("Golden Predictive Intelligence Closed-Loop Journey", () => {
  it("should execute the full closed-loop predictive lifecycle end-to-end", async () => {
    // 1. National Demand Forecast
    const nationalForecast = await demandForecastService.getNationalDemandForecast();
    expect(nationalForecast.scope).toBe("NATIONAL");
    expect(nationalForecast.forecastDemand).toBeGreaterThan(nationalForecast.currentDemand);

    // 2. Emerging Skill Prediction & Adoption Curve
    const emergingSkill = await skillPredictionService.getSkillForecast("skill-bms");
    expect(emergingSkill).toBeDefined();
    expect(emergingSkill?.adoptionStage).toBe("ACCELERATION");

    // 3. Skill Obsolescence Detection & Substitution Bridge
    const substitution = await skillPredictionService.getSkillSubstitutionAnalysis("skill-manual-arc-weld");
    expect(substitution?.obsolescenceRisk).toBe("CRITICAL");
    expect(substitution?.substitutes[0].skillName).toContain("Robotic");

    // 4. Role Trajectory Projections
    const roleForecast = await roleForecastService.getRoleForecastById("role-bms-specialist");
    expect(roleForecast?.trajectoryStatus).toBe("RISING");

    // 5. Candidate Career Trajectory & Transferable Skills
    const trajectories = await careerTrajectoryService.getCandidateTrajectories("cand-rohit-01");
    expect(trajectories.length).toBeGreaterThan(0);
    const transition = await careerTrajectoryService.analyzeCareerTransition("Manual Arc Welder", "Robotic Welding Specialist");
    expect(transition.overallMatchScore).toBeGreaterThanOrEqual(70);

    // 6. Employer Talent Scarcity & Multi-Tier Future Gap
    const gap = await employerTalentScarcityService.getFutureSupplyDemandGap("skill-bms");
    expect(gap.projectedNetGap).toBeGreaterThan(0);

    // 7. Training Curriculum Future-Fit
    const futureFit = await curriculumFutureFitService.getFutureFitEvaluation("course-bms-lead-01");
    expect(futureFit?.futureFitGrade).toBe("FUTURE_READY");

    // 8. What-If Policy Simulation
    const simulation = await scenarioSimulationService.runScenario({
      scenarioName: "National EV Capacity Scaling",
      targetScope: "National Automotive Corridors",
      seatDeltaPercentage: 25,
    });
    expect(simulation.label).toBe("SIMULATION ONLY");
    expect(simulation.deltaImpact.placementsDelta).toBeGreaterThan(0);

    // 9. Predictive Early Warning Alert
    const alerts = await predictiveRiskAlertService.getAllAlerts();
    expect(alerts.length).toBeGreaterThan(0);

    // 10. Forecast Model Registry & Drift
    const models = await modelRegistryService.getAllModels();
    expect(models.filter((m) => m.status === "ACTIVE").length).toBeGreaterThanOrEqual(2);

    // 11. Grounded Copilot Explanation
    const copilotAnswer = await careerisCopilotService.ask({
      userRole: "GOVERNMENT_ADMIN",
      query: "What skills are growing fastest across India?",
    });
    expect(copilotAnswer.classification).toBe("FORECAST");
    expect(copilotAnswer.answer).toContain("Battery Management Systems");
    expect(copilotAnswer.why.length).toBeGreaterThan(0);
    expect(copilotAnswer.evidence.length).toBeGreaterThan(0);
  });
});
