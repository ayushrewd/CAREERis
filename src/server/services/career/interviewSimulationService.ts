// ==============================================================================
// CAREERIS INTERVIEW SIMULATION SERVICE
// Technical, Situational & Behavioral Practice Questions with Rubric Outlines
// ==============================================================================

import { candidateGuidanceRepository } from "@/server/repositories/candidateGuidanceRepository";
import { InterviewPracticeQuestion } from "@/types/candidateGuidance";

export const interviewSimulationService = {
  async getQuestions(roleTarget?: string): Promise<InterviewPracticeQuestion[]> {
    return candidateGuidanceRepository.getInterviewQuestions(roleTarget);
  },
};
