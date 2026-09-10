// ==============================================================================
// CAREERIS TRAINING PLAN SERVICE
// District, State & National Capacity Plans for Government Integration
// ==============================================================================

import { trainingPlanRepository } from "@/server/repositories/trainingPlanRepository";

export const trainingPlanService = {
  async getDistrictTrainingPlan(districtId: string) {
    return trainingPlanRepository.findByScope("DISTRICT", districtId);
  },

  async getStateTrainingPlan(stateCode: string) {
    return trainingPlanRepository.findByScope("STATE", stateCode);
  },

  async getNationalTrainingPlan() {
    return trainingPlanRepository.findByScope("NATIONAL");
  },
};
