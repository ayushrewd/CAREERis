import { EmployerDemandSignal } from "@/types/decisionIntelligence";
import { employerValidationRepository } from "@/server/repositories/employerValidationRepository";

export const employerDemandValidationService = {
  async submitDemandSignal(data: Omit<EmployerDemandSignal, "id" | "createdAt">): Promise<EmployerDemandSignal> {
    return employerValidationRepository.createEmployerSignal(data);
  },

  async getSignalsByEmployer(employerId: string): Promise<EmployerDemandSignal[]> {
    return employerValidationRepository.findAllEmployerSignals({ employerId });
  },

  async getAllSignals(params?: { district?: string; skillId?: string }): Promise<EmployerDemandSignal[]> {
    return employerValidationRepository.findAllEmployerSignals(params);
  },
};
