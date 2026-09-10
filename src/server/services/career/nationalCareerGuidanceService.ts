// ==============================================================================
// CAREERIS NATIONAL CAREER GUIDANCE SERVICE
// Personalized Career Discovery, Fit Scoring & Adjacent Transition Graphs
// ==============================================================================

import { candidateGuidanceRepository } from "@/server/repositories/candidateGuidanceRepository";
import { PersonalizedCareerDiscoveryRecord, CareerTransitionModel } from "@/types/candidateGuidance";

export const nationalCareerGuidanceService = {
  async getCareerDiscoveries(candidateId?: string): Promise<PersonalizedCareerDiscoveryRecord[]> {
    return candidateGuidanceRepository.getCareerDiscoveries(candidateId);
  },

  async getCareerTransitions(): Promise<CareerTransitionModel[]> {
    return candidateGuidanceRepository.getCareerTransitions();
  },
};
