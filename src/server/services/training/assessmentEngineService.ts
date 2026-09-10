// ==============================================================================
// CAREERIS ASSESSMENT ENGINE SERVICE
// Question Bank Management, Proctored Attempts & Verifiable Skill Grading
// ==============================================================================

import { trainingOperationsRepository } from "@/server/repositories/trainingOperationsRepository";
import { AssessmentQuestionItem, AssessmentAttemptRecord } from "@/types/trainingOperations";

export const assessmentEngineService = {
  async getQuestions(skillId?: string): Promise<AssessmentQuestionItem[]> {
    return trainingOperationsRepository.getQuestionsBySkill(skillId);
  },

  async getAttempts(candidateId?: string): Promise<AssessmentAttemptRecord[]> {
    return trainingOperationsRepository.getAttempts(candidateId);
  },

  async submitAttempt(attempt: Partial<AssessmentAttemptRecord>): Promise<AssessmentAttemptRecord> {
    return trainingOperationsRepository.submitAttempt(attempt);
  },
};
