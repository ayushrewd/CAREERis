// ==============================================================================
// CAREERIS DEMAND FORECAST SERVICE
// Multi-Horizon National, State, District, Cluster & Industry Demand Forecasting
// ==============================================================================

import { demandForecastRepository } from "@/server/repositories/demandForecastRepository";
import { LabourDemandForecast, ForecastHorizon } from "@/types/predictiveIntelligence";

export const demandForecastService = {
  async getForecasts(params?: { scope?: string; entityId?: string }): Promise<LabourDemandForecast[]> {
    return demandForecastRepository.findAll(params);
  },

  async getForecastById(id: string): Promise<LabourDemandForecast | null> {
    return demandForecastRepository.findById(id);
  },

  async getNationalDemandForecast(): Promise<LabourDemandForecast> {
    return demandForecastRepository.getNationalOverview();
  },

  async getHorizonForecast(horizon: ForecastHorizon, scope: "NATIONAL" | "STATE" | "DISTRICT" = "NATIONAL") {
    const fc = await this.getNationalDemandForecast();
    return {
      scope,
      forecastHorizon: horizon,
      currentDemand: fc.currentDemand,
      projectedDemand: fc.forecastDemand,
      percentageChange: fc.percentageChange,
      trend: fc.trend,
      confidenceScore: fc.confidenceScore,
      projections: fc.projections,
      majorDriverSignals: fc.majorDriverSignals,
    };
  },
};
