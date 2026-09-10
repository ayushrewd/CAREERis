// ==============================================================================
// CAREERIS CAREER COMPARISON & SIMULATION SERVICE
// Multi-Role Opportunity Evaluation & Step-by-Step Transition Simulation
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { CareerComparisonResult, CareerSimulationPlan } from "@/types/careerOperatingSystem";

export const careerComparisonAndSimulationService = {
  async compareCareers(roleIds?: string[]): Promise<CareerComparisonResult> {
    return careerOperatingSystemRepository.getCareerComparison(roleIds);
  },

  async simulateCareerPath(params: {
    candidateId: string;
    targetRoleId: string;
  }): Promise<CareerSimulationPlan> {
    return careerOperatingSystemRepository.getCareerSimulation(params.candidateId, params.targetRoleId);
  },
};
