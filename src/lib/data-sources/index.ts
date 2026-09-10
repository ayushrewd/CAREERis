import { DataSource, DataSourceType } from "@/types";

export const SEED_DATA_SOURCES: DataSource[] = [
  {
    id: "ds-emp-exchange-mh",
    name: "Maharashtra State Employment & Skill Exchange Portal",
    sourceType: "GOVERNMENT_DATA",
    collectionDate: "2026-01-15T00:00:00Z",
    timePeriod: "Q1 2026",
    geographyScope: "Maharashtra (All 36 Districts)",
    confidence: 94,
    methodology: "Direct administrative integration with state vocational database",
    version: "v2.4",
  },
  {
    id: "ds-sih-industry-survey",
    name: "SIH Automotive & Electronics Industry Council Survey",
    sourceType: "EMPLOYER_SURVEYS",
    collectionDate: "2026-02-01T00:00:00Z",
    timePeriod: "FY 2025-26",
    geographyScope: "Chakan, Sanand, Sriperumbudur, Electronic City",
    confidence: 88,
    methodology: "Empirical survey of 450+ industrial employers across Tier-1/Tier-2 clusters",
    version: "v1.2",
  },
  {
    id: "ds-tech-pulse-ai",
    name: "National Emerging Skills & Requisition Radar",
    sourceType: "JOB_POSTINGS",
    collectionDate: "2026-02-20T00:00:00Z",
    timePeriod: "Last 90 Days",
    geographyScope: "Pan-India",
    confidence: 82,
    methodology: "Deduplicated aggregation of 120,000+ verified corporate job postings",
    version: "v3.0",
  },
  {
    id: "ds-iti-infrastructure-audit",
    name: "National ITI Equipment & Trainer Capacity Census",
    sourceType: "TRAINING_DATA",
    collectionDate: "2025-11-30T00:00:00Z",
    timePeriod: "Academic Year 2025-26",
    geographyScope: "Pan-India (28 States, 8 UTs)",
    confidence: 91,
    methodology: "Physical and digital verification audit by Sector Skill Councils",
    version: "v2025.A",
  }
];

export interface VerifiedMetric<T> {
  value: T;
  dataSource: DataSource;
  isSimulatedDemoData?: boolean;
  confidenceScore: number;
  lastVerifiedAt: string;
}

export function createVerifiedMetric<T>(
  value: T,
  sourceId: string,
  options?: { isSimulatedDemoData?: boolean; customConfidence?: number }
): VerifiedMetric<T> {
  const source =
    SEED_DATA_SOURCES.find((s) => s.id === sourceId) || SEED_DATA_SOURCES[0];

  return {
    value,
    dataSource: source,
    isSimulatedDemoData: options?.isSimulatedDemoData ?? true,
    confidenceScore: options?.customConfidence ?? source.confidence,
    lastVerifiedAt: source.collectionDate,
  };
}
