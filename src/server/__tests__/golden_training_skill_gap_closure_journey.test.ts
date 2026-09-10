import { describe, it, expect } from "vitest";
import { courseMarketplaceService } from "@/server/services/training/courseMarketplaceService";
import { curriculumVersionService } from "@/server/services/training/curriculumVersionService";
import { assessmentEngineService } from "@/server/services/training/assessmentEngineService";
import { trainingRequestMarketplaceService } from "@/server/services/training/trainingRequestMarketplaceService";
import { aiLearningAdvisorService } from "@/server/services/training/aiLearningAdvisorService";

describe("Golden Training Ecosystem & Skill Gap Closure Closed-Loop Journey", () => {
  it("should execute the complete training lifecycle from skill gap to verified credential and placement", async () => {
    // 1. Employer Demand & Training Request
    const requests = await trainingRequestMarketplaceService.getTrainingRequests();
    expect(requests.length).toBeGreaterThan(0);
    const evReq = requests[0];
    expect(evReq.roleTargetTitle).toContain("EV Battery System Calibration");
    expect(evReq.headcountNeeded).toBe(50);

    // 2. AI Learning Advisor Recommendation
    const advisorResponse = await aiLearningAdvisorService.askLearningAdvisor({
      candidateId: "cand-rohit-01",
      query: "Which course will help me bridge my BMS gap for Tata Motors hiring?",
    });
    expect(advisorResponse.recommendedCourses.length).toBeGreaterThan(0);
    const topCourseRec = advisorResponse.recommendedCourses[0];
    expect(topCourseRec.providerName).toContain("Government ITI Aundh");

    // 3. Course Blueprint & Curriculum Verification
    const course = await courseMarketplaceService.getCourseById(topCourseRec.courseId);
    expect(course).toBeDefined();
    expect(course?.courseHealthScore).toBeGreaterThanOrEqual(90);
    expect(course?.placementRatePercentage).toBeGreaterThan(90);

    const curriculum = await curriculumVersionService.getCurriculumByCourseId(topCourseRec.courseId);
    expect(curriculum).toBeDefined();
    expect(curriculum?.marketAlignmentScore).toBe(96);
    expect(curriculum?.modules.length).toBeGreaterThanOrEqual(4);

    // 4. Batch Availability & Capacity
    const batches = await courseMarketplaceService.getBatchesForCourse(topCourseRec.courseId);
    expect(batches.length).toBeGreaterThan(0);
    expect(batches[0].status).toBe("OPEN");

    // 5. Assessment Attempt & Verifiable Credential Scoring
    const questions = await assessmentEngineService.getQuestions("skill-hv-safety");
    expect(questions.length).toBeGreaterThan(0);

    const attempt = await assessmentEngineService.submitAttempt({
      assessmentId: "assess-asdc-bms-2026",
      candidateId: "cand-rohit-01",
      candidateName: "Rohit Sharma",
      scorePercentage: 94,
      skillLevelBreakdown: [
        { skillName: "High-Voltage Safety Protocols", score: 98, isVerified: true },
        { skillName: "Battery Management Systems (BMS)", score: 92, isVerified: true },
        { skillName: "CAN Bus Diagnostics", score: 92, isVerified: true },
      ],
    });
    expect(attempt.status).toBe("VERIFIED");
    expect(attempt.scorePercentage).toBe(94);
  });
});
