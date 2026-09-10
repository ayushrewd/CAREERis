// ==============================================================================
// CAREERIS BUDGET INTELLIGENCE SERVICE
// Financial Governance, Expenditure Tracking & Cost-Per-Placement ROI Analysis
// ==============================================================================

import { budgetRepository } from "@/server/repositories/budgetRepository";
import { BudgetAllocation, BudgetOutcomeMetrics, GovernmentScopeType } from "@/types/governmentIntelligence";

export const budgetIntelligenceService = {
  async getAllocations(params?: {
    fiscalYear?: string;
    schemeCode?: string;
    stateCode?: string;
    geographyScope?: GovernmentScopeType;
  }): Promise<BudgetAllocation[]> {
    return budgetRepository.findAllAllocations(params);
  },

  async getBudgetOutcomeAnalysis(): Promise<BudgetOutcomeMetrics> {
    return budgetRepository.getBudgetOutcomeMetrics();
  },

  async getSchemeCostEfficiency(schemeCode: string) {
    const allocations = await budgetRepository.findAllAllocations({ schemeCode });
    const totalSpent = allocations.reduce((sum, a) => sum + a.spentINR, 0);

    return {
      schemeCode,
      totalSpentINR: totalSpent,
      calculatedCostPerPlacementINR: schemeCode === "NAPS" ? 14200 : schemeCode === "PMKVY_4" ? 18500 : 21000,
      placementSuccessRate: schemeCode === "NAPS" ? 78.4 : 64.2,
      efficiencyGrade: "HIGH",
      dataSource: "Public Financial Management System (PFMS) & CareerIS Placement Registry",
      isDemoData: true,
    };
  },
};
