// ==============================================================================
// CAREERIS POLICY SCENARIO SIMULATOR SERVICE
// Modelled What-If Analysis for Seat Expansions, Trainer Retraining & Lab Modernization
// ==============================================================================

import { policyIntelligenceRepository } from "@/server/repositories/policyIntelligenceRepository";
import { PolicyScenarioModel } from "@/types/policyIntelligence";

export const policyScenarioSimulatorService = {
  async getScenarios(): Promise<PolicyScenarioModel[]> {
    return policyIntelligenceRepository.getScenarios();
  },

  async simulateScenario(params: Partial<PolicyScenarioModel>): Promise<PolicyScenarioModel> {
    return policyIntelligenceRepository.createScenario(params);
  },
};
