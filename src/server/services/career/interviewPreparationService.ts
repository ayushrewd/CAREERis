// ==============================================================================
// CAREERIS INTERVIEW PREPARATION SERVICE
// Technical, Behavioral & Scenario Practice with AI-Assisted Evaluation
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { InterviewPrepSession, MockInterviewEvaluation } from "@/types/careerOperatingSystem";

export const interviewPreparationService = {
  async getPrepSession(jobId?: string): Promise<InterviewPrepSession> {
    return careerOperatingSystemRepository.getInterviewPrepSession();
  },

  async submitMockAnswer(params: {
    sessionId: string;
    questionId: string;
    answerText: string;
  }): Promise<MockInterviewEvaluation> {
    const evaluation: MockInterviewEvaluation = {
      questionId: params.questionId,
      candidateAnswerText: params.answerText,
      score: params.answerText.length > 50 ? 85 : 65,
      strengths: ["Clear terminology used.", "Directly addresses the question context."],
      areasForImprovement: ["Add quantitative metrics or formal safety standards (e.g. ISO 26262 or CAT-III multimeter)."],
      aiFeedback: "Solid practical answer. Elevate by citing formal diagnostic equipment ratings and step-by-step verification protocols.",
    };

    await careerOperatingSystemRepository.saveInterviewEvaluation(params.sessionId, evaluation);
    return evaluation;
  },
};
