// ==============================================================================
// CAREERIS DISTRICT RISK & EARLY WARNING SERVICE
// 9-Dimension Risk Detection, Early Warnings & Conflicting Signals Detection
// ==============================================================================

import { districtRiskRepository } from "@/server/repositories/districtRiskRepository";
import { DistrictRiskItem, EarlyWarningAlert, DistrictRiskCategory } from "@/types/governmentIntelligence";

export const districtRiskService = {
  async getDistrictRisks(params?: {
    districtId?: string;
    stateCode?: string;
    riskCategory?: DistrictRiskCategory;
    severity?: string;
  }): Promise<DistrictRiskItem[]> {
    return districtRiskRepository.findAllRisks(params);
  },

  async getEarlyWarningAlerts(params?: { stateCode?: string; severity?: string }): Promise<EarlyWarningAlert[]> {
    return districtRiskRepository.findAllAlerts(params);
  },

  async getDataQualityScorecard() {
    return {
      nationalCompletenessScore: 94.2,
      freshnessAverageHours: 18.5,
      duplicateRecordRatePercentage: 0.8,
      unresolvedSkillCount: 2,
      unresolvedRolesCount: 1,
      sourceReliabilityScores: [
        { sourceName: "Ministry of Corporate Affairs (MCA21)", reliabilityScore: 98 },
        { sourceName: "Automotive Skills Development Council (ASDC)", reliabilityScore: 96 },
        { sourceName: "Employees' Provident Fund Organisation (EPFO)", reliabilityScore: 95 },
        { sourceName: "Directorate of Vocational Education & Training (DVET)", reliabilityScore: 92 },
      ],
      conflictingSignalsDetected: [
        {
          metric: "Reported BMS Technician Vacancies in Pune",
          sourceA: { name: "EPFO Payroll Job Postings", value: 4800 },
          sourceB: { name: "Job Portal Ingestion Feed", value: 3900 },
          variancePercentage: 23,
          probableCause: "Portal feed does not capture direct unlisted tier-2 supplier plant hiring.",
          resolutionStatus: "RESOLVED_VIA_EVIDENCE_FUSION",
          fusedValue: 4500,
        },
      ],
      isDemoData: true,
    };
  },
};
