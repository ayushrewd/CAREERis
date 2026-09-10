// ==============================================================================
// CAREERIS FORECAST MODEL REPOSITORY
// Model Registry, Metrics, Drift Monitoring & Backtesting Records
// ==============================================================================

import { ForecastModelRecord } from "@/types/predictiveIntelligence";
import {
  CANONICAL_FORECAST_MODELS,
  CANONICAL_BACKTESTING_LOGS,
} from "@/data/canonicalForecastModelsData";

let inMemoryModels: ForecastModelRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_FORECAST_MODELS)
);
let inMemoryBacktests = JSON.parse(JSON.stringify(CANONICAL_BACKTESTING_LOGS));

export const forecastModelRepository = {
  async getAllModels(): Promise<ForecastModelRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryModels));
  },

  async getModelById(modelId: string): Promise<ForecastModelRecord | null> {
    const found = inMemoryModels.find((m) => m.modelId === modelId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getBacktestingLogs() {
    return JSON.parse(JSON.stringify(inMemoryBacktests));
  },
};
