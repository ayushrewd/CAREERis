// ==============================================================================
// CAREERIS MODEL REGISTRY SERVICE
// ML Model Tracking, Performance Metrics, Drift Monitoring & Backtesting
// ==============================================================================

import { forecastModelRepository } from "@/server/repositories/forecastModelRepository";
import { ForecastModelRecord } from "@/types/predictiveIntelligence";

export const modelRegistryService = {
  async getAllModels(): Promise<ForecastModelRecord[]> {
    return forecastModelRepository.getAllModels();
  },

  async getModelById(modelId: string): Promise<ForecastModelRecord | null> {
    return forecastModelRepository.getModelById(modelId);
  },

  async getBacktestReports() {
    return forecastModelRepository.getBacktestingLogs();
  },

  async getModelHealthScorecard() {
    const models = await this.getAllModels();
    const activeModels = models.filter((m) => m.status === "ACTIVE");
    const avgMape = activeModels.reduce((acc, m) => acc + m.metrics.mapePercentage, 0) / Math.max(1, activeModels.length);

    return {
      totalRegisteredModels: models.length,
      activeProductionModels: activeModels.length,
      shadowCandidateModels: models.filter((m) => m.status === "SHADOW").length,
      averageMapePercentage: parseFloat(avgMape.toFixed(2)),
      overallDriftStatus: models.some((m) => m.driftStatus === "DEGRADED") ? "DEGRADED" : "HEALTHY",
      lastAuditTimestamp: new Date().toISOString(),
    };
  },
};
