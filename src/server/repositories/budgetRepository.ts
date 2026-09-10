// ==============================================================================
// CAREERIS BUDGET REPOSITORY
// Fiscal Year Allocations, Expenditure & Budget-to-Outcome Registry
// ==============================================================================

import { BudgetAllocation, BudgetOutcomeMetrics, GovernmentScopeType } from "@/types/governmentIntelligence";
import { CANONICAL_BUDGET_ALLOCATIONS, CANONICAL_BUDGET_OUTCOME_METRICS } from "@/data/canonicalBudgetsData";

let inMemoryAllocations: BudgetAllocation[] = JSON.parse(JSON.stringify(CANONICAL_BUDGET_ALLOCATIONS));
let inMemoryOutcomeMetrics: BudgetOutcomeMetrics = JSON.parse(JSON.stringify(CANONICAL_BUDGET_OUTCOME_METRICS));

export const budgetRepository = {
  async findAllAllocations(params?: {
    fiscalYear?: string;
    schemeCode?: string;
    stateCode?: string;
    geographyScope?: GovernmentScopeType;
  }): Promise<BudgetAllocation[]> {
    let list = [...inMemoryAllocations];

    if (params?.fiscalYear) {
      list = list.filter((b) => b.fiscalYear === params.fiscalYear);
    }
    if (params?.schemeCode) {
      list = list.filter((b) => b.schemeCode === params.schemeCode);
    }
    if (params?.stateCode) {
      list = list.filter((b) => !b.stateCode || b.stateCode === params.stateCode);
    }
    if (params?.geographyScope) {
      list = list.filter((b) => b.geographyScope === params.geographyScope);
    }

    return list;
  },

  async findAllocationById(id: string): Promise<BudgetAllocation | null> {
    const found = inMemoryAllocations.find((b) => b.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createAllocation(data: Omit<BudgetAllocation, "id">): Promise<BudgetAllocation> {
    const newAlloc: BudgetAllocation = {
      ...data,
      id: `budget-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryAllocations.unshift(newAlloc);
    return newAlloc;
  },

  async getBudgetOutcomeMetrics(): Promise<BudgetOutcomeMetrics> {
    return JSON.parse(JSON.stringify(inMemoryOutcomeMetrics));
  },
};
