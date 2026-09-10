import { describe, it, expect } from "vitest";
import { nationalCareerGuidanceService } from "@/server/services/career/nationalCareerGuidanceService";
import { candidateEmployabilityService } from "@/server/services/career/candidateEmployabilityService";
import { interviewSimulationService } from "@/server/services/career/interviewSimulationService";
import { groundedCareerCopilotAdvisorService } from "@/server/services/career/groundedCareerCopilotAdvisorService";

describe("Golden Candidate National Career Guidance & Operating System Closed-Loop Journey", () => {
  it("should execute the complete candidate lifecycle from career discovery to interview readiness and placement match", async () => {
    const candidateId = "cand-rohit-01";

    // 1. Career Discovery & Fit Scoring
    const discoveries = await nationalCareerGuidanceService.getCareerDiscoveries(candidateId);
    expect(discoveries.length).toBeGreaterThanOrEqual(3);
    const topRole = discoveries[0];
    expect(topRole.fitClassification).toBe("BEST_FIT");
    expect(topRole.fitScore).toBe(86);
    expect(topRole.missingSkills).toContain("Battery Management Systems (BMS)");

    // 2. Career Transition & Skill Transferability
    const transitions = await nationalCareerGuidanceService.getCareerTransitions();
    expect(transitions.length).toBeGreaterThan(0);
    const transition = transitions[0];
    expect(transition.skillTransferabilityPercentage).toBe(72);
    expect(transition.estimatedLearningWeeks).toBe(4);

    // 3. Grounded Career Copilot Consultation
    const copilotResponse = await groundedCareerCopilotAdvisorService.askCareerCopilot({
      candidateId,
      query: "What should I do next to get hired by Tata Motors?",
    });
    expect(copilotResponse.answerText).toContain("84% ready");
    expect(copilotResponse.recommendedNextActions.length).toBeGreaterThan(0);

    // 4. Employability Scorecard & Next Best Actions
    const scorecard = await candidateEmployabilityService.getScorecard(candidateId);
    expect(scorecard.overallReadinessScore).toBe(84);
    expect(scorecard.readinessLevel).toBe("MODERATELY_READY");
    expect(scorecard.components.skillCoverage).toBe(88);

    const action = scorecard.nextBestActions[0];
    expect(action.priority).toBe("CRITICAL");

    // 5. Action Completion
    const updatedAction = await candidateEmployabilityService.toggleAction(action.actionId, true);
    expect(updatedAction?.isCompleted).toBe(true);

    // 6. Interview Practice Simulation
    const interviewQuestions = await interviewSimulationService.getQuestions(topRole.roleTitle);
    expect(interviewQuestions.length).toBeGreaterThan(0);
    expect(interviewQuestions[0].sampleAnswerOutline).toContain("Manual Service Disconnect");
  });
});
