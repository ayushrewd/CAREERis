// ==============================================================================
// CAREERIS DISTRICT RISK & EARLY WARNING REPOSITORY
// 9-Dimension Risk Scoring, Priorities & Real-time Alerts
// ==============================================================================

import { DistrictRiskItem, EarlyWarningAlert, DistrictPriorityCalculation, DistrictRiskCategory } from "@/types/governmentIntelligence";
import {
  CANONICAL_DISTRICT_RISKS,
  CANONICAL_EARLY_WARNING_ALERTS,
  CANONICAL_DISTRICT_PRIORITIES,
} from "@/data/canonicalDistrictRisksData";

let inMemoryRisks: DistrictRiskItem[] = JSON.parse(JSON.stringify(CANONICAL_DISTRICT_RISKS));
let inMemoryAlerts: EarlyWarningAlert[] = JSON.parse(JSON.stringify(CANONICAL_EARLY_WARNING_ALERTS));
let inMemoryPriorities: DistrictPriorityCalculation[] = JSON.parse(JSON.stringify(CANONICAL_DISTRICT_PRIORITIES));

export const districtRiskRepository = {
  async findAllRisks(params?: {
    districtId?: string;
    stateCode?: string;
    riskCategory?: DistrictRiskCategory;
    severity?: string;
  }): Promise<DistrictRiskItem[]> {
    let list = [...inMemoryRisks];

    if (params?.districtId) {
      list = list.filter((r) => r.districtId.toLowerCase() === params.districtId!.toLowerCase());
    }
    if (params?.stateCode) {
      list = list.filter((r) => r.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.riskCategory) {
      list = list.filter((r) => r.riskCategory === params.riskCategory);
    }
    if (params?.severity) {
      list = list.filter((r) => r.severity === params.severity);
    }

    return list;
  },

  async findAllAlerts(params?: { stateCode?: string; severity?: string }): Promise<EarlyWarningAlert[]> {
    let list = [...inMemoryAlerts];
    if (params?.stateCode) {
      list = list.filter((a) => a.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.severity) {
      list = list.filter((a) => a.severity === params.severity);
    }
    return list;
  },

  async findAllPriorities(params?: { stateCode?: string }): Promise<DistrictPriorityCalculation[]> {
    let list = [...inMemoryPriorities];
    if (params?.stateCode) {
      list = list.filter((p) => p.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    return list.sort((a, b) => b.priorityScore - a.priorityScore);
  },

  async findPriorityByDistrictId(districtId: string): Promise<DistrictPriorityCalculation | null> {
    const found = inMemoryPriorities.find((p) => p.districtId.toLowerCase() === districtId.toLowerCase());
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
};
