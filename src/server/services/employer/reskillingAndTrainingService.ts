// ==============================================================================
// CAREERIS RESKILLING & TRAINING PARTNERSHIP SERVICE
// Internal Reskilling Pathways & Accredited Training Partner Discovery
// ==============================================================================

import { employerOperationsRepository } from "@/server/repositories/employerOperationsRepository";
import { EmployerReskillingPathway, TrainingPartnerDetail } from "@/types/employerOperations";

export const reskillingAndTrainingService = {
  async getReskillingPathways(employerId: string): Promise<EmployerReskillingPathway[]> {
    return employerOperationsRepository.getReskillingPathways(employerId);
  },

  async getTrainingPartners(): Promise<TrainingPartnerDetail[]> {
    return employerOperationsRepository.getTrainingPartners();
  },
};
