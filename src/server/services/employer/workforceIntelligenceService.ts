// ==============================================================================
// CAREERIS WORKFORCE INTELLIGENCE SERVICE
// Multi-Horizon Demand Forecasting, Gap Analysis & Scenario Simulations
// ==============================================================================

import { employerOperationsRepository } from "@/server/repositories/employerOperationsRepository";
import { WorkforceForecastHorizon, WorkforceScenarioSimulation } from "@/types/employerOperations";

export const workforceIntelligenceService = {
  async getWorkforceForecasts(employerId: string): Promise<WorkforceForecastHorizon[]> {
    return employerOperationsRepository.getWorkforceForecasts(employerId);
  },

  async getWorkforceScenarios(employerId: string): Promise<WorkforceScenarioSimulation[]> {
    return employerOperationsRepository.getWorkforceScenarios(employerId);
  },
};
