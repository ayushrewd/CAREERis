import { describe, it, expect } from "vitest";
import { careerCopilotGroundedService } from "@/server/services/career/careerCopilotGroundedService";
import { careerComparisonAndSimulationService } from "@/server/services/career/careerComparisonAndSimulationService";
import { nextBestActionService } from "@/server/services/career/nextBestActionService";
import { resumeIntelligenceService } from "@/server/services/career/resumeIntelligenceService";
import { interviewPreparationService } from "@/server/services/career/interviewPreparationService";
import { applicationIntelligenceService } from "@/server/services/career/applicationIntelligenceService";
import { careerJourneyService } from "@/server/services/career/careerJourneyService";

describe("Golden Candidate Personal Career Operating System Closed-Loop Journey", () => {
  it("should execute the complete candidate career progression journey from exploration to 365-day retention", async () => {
    const candidateId = "cand-rohit-01";

    // 1. Grounded Copilot Query
    const copilotResponse = await careerCopilotGroundedService.askCareerCopilot({
      candidateId,
      query: "What career paths fit my background in electrical systems?",
    });
    expect(copilotResponse.answerText).toContain("EV Battery System Calibration Specialist");
    expect(copilotResponse.confidenceScore).toBeGreaterThan(90);

    // 2. Multi-Path Career Comparison
    const comparison = await careerComparisonAndSimulationService.compareCareers();
    expect(comparison.roles.length).toBeGreaterThanOrEqual(3);
    const topRole = comparison.roles[0];
    expect(topRole.roleTitle).toContain("EV Battery System Diagnostic Specialist");
    expect(topRole.overallMatchScore).toBe(88);

    // 3. Step-by-Step Transition Simulator
    const simulation = await careerComparisonAndSimulationService.simulateCareerPath({
      candidateId,
      targetRoleId: topRole.roleId,
    });
    expect(simulation.steps.length).toBeGreaterThanOrEqual(5);
    expect(simulation.projectedReadinessScore).toBe(96);

    // 4. Ranked Next Best Actions
    const actions = await nextBestActionService.getRankedActions(candidateId);
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].priorityScore).toBeGreaterThanOrEqual(90);

    // 5. Resume Intelligence & ATS Optimization
    const resumeOpt = await resumeIntelligenceService.optimizeResumeForJob({
      candidateId,
      targetJobId: "job-ev-calibration-01",
    });
    expect(resumeOpt.overallMatchPercentage).toBe(88);
    expect(resumeOpt.matchedSkills.length).toBeGreaterThanOrEqual(5);

    // 6. Interview Preparation & Mock Evaluation
    const prepSession = await interviewPreparationService.getPrepSession();
    expect(prepSession.questions.length).toBeGreaterThanOrEqual(3);
    const evaluation = await interviewPreparationService.submitMockAnswer({
      sessionId: prepSession.sessionId,
      questionId: prepSession.questions[0].questionId,
      answerText: "Isolate HVIL loop using calibrated multimeter and verify zero voltage before MSD disconnect.",
    });
    expect(evaluation.score).toBeGreaterThan(70);

    // 7. Application Intelligence & Rejection Pattern Analysis
    const rejections = await applicationIntelligenceService.getRejectionDiagnostics(candidateId);
    expect(rejections.length).toBeGreaterThan(0);
    expect(rejections[0].mismatchFactors.skillGapFactor).toBeDefined();

    // 8. Longitudinal Career Journey
    const milestones = await careerJourneyService.getJourneyMilestones(candidateId);
    expect(milestones.length).toBeGreaterThanOrEqual(6);
    expect(milestones[milestones.length - 1].stage).toBe("RETENTION_MILESTONE");
  });
});
