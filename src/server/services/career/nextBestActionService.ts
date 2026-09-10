// ==============================================================================
// CAREERIS NEXT BEST ACTION SERVICE
// Dynamic Multi-Dimensional Action Prioritization (Impact, Urgency & Market Value)
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { NextBestAction } from "@/types/careerOperatingSystem";

export const nextBestActionService = {
  async getRankedActions(candidateId: string): Promise<NextBestAction[]> {
    const actions = await careerOperatingSystemRepository.getNextBestActions(candidateId);
    // Sort descending by priorityScore
    return actions.sort((a, b) => b.priorityScore - a.priorityScore);
  },
};
