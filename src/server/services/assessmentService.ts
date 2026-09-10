import { assessmentRepository } from "@/server/repositories/assessmentRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";
import { AssessmentAttemptRecord } from "@/lib/store/platformStore";
import { ProficiencyLevel } from "@/types";

export const assessmentService = {
  async getAssessments() {
    return assessmentRepository.findAll();
  },

  async getAssessmentById(id: string) {
    return assessmentRepository.findById(id);
  },

  async submitAttempt(params: {
    assessmentId: string;
    answers: Record<string, number>;
    auth: RequestAuthContext;
  }): Promise<AssessmentAttemptRecord> {
    const asmt = await assessmentRepository.findById(params.assessmentId);
    if (!asmt) {
      throw new Error(`Assessment not found: ${params.assessmentId}`);
    }

    // Grade questions
    let correctCount = 0;
    asmt.questions.forEach((q) => {
      if (params.answers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / Math.max(1, asmt.questions.length)) * 100);
    const isPassed = score >= asmt.passingScore;

    let proficiencyGranted: ProficiencyLevel = "FOUNDATIONAL";
    if (score >= 90) proficiencyGranted = "EXPERT";
    else if (score >= 75) proficiencyGranted = "ADVANCED";
    else if (score >= 60) proficiencyGranted = "INTERMEDIATE";

    // 1. Save attempt record
    const attempt = await assessmentRepository.saveAttempt({
      assessmentId: asmt.id,
      assessmentTitle: asmt.title,
      candidateId: params.auth.userId,
      score,
      isPassed,
      proficiencyGranted,
      strengths: ["Core Domain Understanding", "Standards Compliance"],
      weaknesses: isPassed ? [] : ["Needs review on advanced fault scenarios"],
    });

    // 2. Transactionally update candidate's Skill Passport
    if (isPassed) {
      await candidateRepository.addOrUpdateSkill(params.auth.userId, {
        skillId: asmt.skillId,
        skillName: asmt.skillName,
        claimedProficiency: proficiencyGranted,
        assessedScore: score,
        verificationStatus: "ASSESSMENT_VERIFIED",
        verifiedAt: new Date().toISOString(),
        evidenceCount: 3,
      });

      // Recalculate readiness score
      const cand = await candidateRepository.getProfile(params.auth.userId);
      const verifiedCount = cand.skills.filter((s) => s.verificationStatus === "ASSESSMENT_VERIFIED").length;
      const newReadiness = Math.min(98, 70 + verifiedCount * 6);
      await candidateRepository.updateReadinessScore(params.auth.userId, newReadiness);
    }

    // 3. Dispatch Notification
    await notificationRepository.create({
      userId: params.auth.userId,
      type: "ASSESSMENT",
      title: isPassed ? `Assessment Passed: ${asmt.title}` : `Assessment Completed: ${asmt.title}`,
      message: isPassed
        ? `Congratulations! You scored ${score}% and earned the verified ${proficiencyGranted} badge for ${asmt.skillName}.`
        : `You scored ${score}%. The passing threshold is ${asmt.passingScore}%. You may retake after 7 days.`,
      actionUrl: `/candidate/skills`,
    });

    // 4. Audit Log
    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "ASSESSMENT_SUBMITTED",
      entity: "AssessmentAttempt",
      entityId: attempt.id,
      details: { assessmentId: asmt.id, score, isPassed, proficiencyGranted },
    });

    return attempt;
  },
};
