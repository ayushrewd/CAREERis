// ==============================================================================
// CAREERIS CANONICAL FORECAST MODELS REGISTRY DATA
// ML Model Tracking, Performance Metrics, Drift Monitoring & Backtesting Logs
// ==============================================================================

import { ForecastModelRecord } from "@/types/predictiveIntelligence";

export const CANONICAL_FORECAST_MODELS: ForecastModelRecord[] = [
  {
    modelId: "model-arimax-national-demand-v2",
    modelName: "National ARIMA-X Multi-Horizon Demand Predictor",
    version: "v2.4.1",
    algorithm: "Seasonal AutoRegressive Integrated Moving Average with Exogenous Economic Features (ARIMA-X)",
    forecastHorizon: "12M",
    metrics: {
      mae: 4200,
      rmse: 6800,
      mapePercentage: 3.8,
      calibrationScore: 0.94,
    },
    status: "ACTIVE",
    driftStatus: "HEALTHY",
    lastTrainedAt: "2026-01-15T00:00:00Z",
    lastEvaluatedAt: "2026-02-15T00:00:00Z",
  },
  {
    modelId: "model-gradient-boost-skill-diffusion-v3",
    modelName: "Cross-Industry Skill Diffusion Gradient Booster",
    version: "v3.1.0",
    algorithm: "LightGBM + Graph Neural Network Skill Co-occurrence Embedding",
    forecastHorizon: "24M",
    metrics: {
      mae: 180,
      rmse: 310,
      mapePercentage: 4.2,
      calibrationScore: 0.92,
    },
    status: "ACTIVE",
    driftStatus: "HEALTHY",
    lastTrainedAt: "2026-01-20T00:00:00Z",
    lastEvaluatedAt: "2026-02-18T00:00:00Z",
  },
  {
    modelId: "model-lstm-shadow-v1",
    modelName: "Recurrent LSTM Deep Sequence Forecaster (Shadow Candidate)",
    version: "v1.0.0-rc2",
    algorithm: "Bidirectional LSTM with Attention Mechanism for Long-Horizon Volatility",
    forecastHorizon: "36M",
    metrics: {
      mae: 5400,
      rmse: 8900,
      mapePercentage: 5.4,
      calibrationScore: 0.88,
    },
    status: "SHADOW",
    driftStatus: "WATCH",
    lastTrainedAt: "2026-02-01T00:00:00Z",
    lastEvaluatedAt: "2026-02-19T00:00:00Z",
  },
];

export const CANONICAL_BACKTESTING_LOGS = [
  {
    testId: "bt-2025-q4-national",
    modelId: "model-arimax-national-demand-v2",
    evaluationPeriod: "2025-Q1 to 2025-Q4 (12M Backtest)",
    actualDemand: 2450000,
    predictedDemand: 2410000,
    variancePercentage: -1.63,
    passed: true,
    conductedAt: "2026-01-10T10:00:00Z",
  },
  {
    testId: "bt-2025-q4-bms-skill",
    modelId: "model-gradient-boost-skill-diffusion-v3",
    evaluationPeriod: "2025-Q1 to 2025-Q4 (BMS Skill Diffusion Backtest)",
    actualDemand: 14200,
    predictedDemand: 13850,
    variancePercentage: -2.46,
    passed: true,
    conductedAt: "2026-01-12T11:00:00Z",
  },
];
