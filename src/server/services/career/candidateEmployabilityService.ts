// ==============================================================================
// CAREERIS CANDIDATE EMPLOYABILITY SERVICE
// Multi-Factor Employability Scorecard, Readiness Factors & Next-Best-Actions
// ==============================================================================

import { candidateGuidanceRepository } from "@/server/repositories/candidateGuidanceRepository";
import { CandidateEmployabilityScorecard, NextBestActionItem } from "@/types/candidateGuidance";

export const candidateEmployabilityService = {
  async getScorecard(candidateId?: string): Promise<CandidateEmployabilityScorecard> {
    return candidateGuidanceRepository.getEmployabilityScorecard(candidateId);
  },

  async toggleAction(actionId: string, isCompleted: boolean): Promise<NextBestActionItem | null> {
    return candidateGuidanceRepository.updateNextBestAction(actionId, isCompleted);
  },
};
