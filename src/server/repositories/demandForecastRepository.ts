// ==============================================================================
// CAREERIS DEMAND FORECAST REPOSITORY
// Historical & Multi-Horizon Labour Demand Projections Registry
// ==============================================================================

import { LabourDemandForecast } from "@/types/predictiveIntelligence";
import { CANONICAL_LABOUR_DEMAND_FORECASTS } from "@/data/canonicalForecastData";

let inMemoryForecasts: LabourDemandForecast[] = JSON.parse(
  JSON.stringify(CANONICAL_LABOUR_DEMAND_FORECASTS)
);

export const demandForecastRepository = {
  async findAll(params?: { scope?: string; entityId?: string }): Promise<LabourDemandForecast[]> {
    let list = [...inMemoryForecasts];
    if (params?.scope) {
      list = list.filter((f) => f.scope.toLowerCase() === params.scope!.toLowerCase());
    }
    if (params?.entityId) {
      list = list.filter((f) => f.scopeEntityId.toLowerCase() === params.entityId!.toLowerCase());
    }
    return list;
  },

  async findById(id: string): Promise<LabourDemandForecast | null> {
    const found = inMemoryForecasts.find((f) => f.id === id);
    if (found) return JSON.parse(JSON.stringify(found));
    return inMemoryForecasts[0] ? JSON.parse(JSON.stringify(inMemoryForecasts[0])) : null;
  },

  async getNationalOverview(): Promise<LabourDemandForecast> {
    return inMemoryForecasts[0];
  },
};
