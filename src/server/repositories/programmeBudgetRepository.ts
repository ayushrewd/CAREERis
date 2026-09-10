// ==============================================================================
// CAREERIS PROGRAMME BUDGET REPOSITORY
// Budget Lines, Allocations, Multi-Source Funding, Variances & Cost-Per-Outcome
// ==============================================================================

import { ProgrammeBudget } from "@/types/programmeOperations";
import { CANONICAL_PROGRAMME_BUDGETS } from "@/data/canonicalProgrammeOperationsData";

let inMemoryBudgets: ProgrammeBudget[] = JSON.parse(
  JSON.stringify(CANONICAL_PROGRAMME_BUDGETS)
);

export const programmeBudgetRepository = {
  async getAllBudgets(): Promise<ProgrammeBudget[]> {
    return JSON.parse(JSON.stringify(inMemoryBudgets));
  },

  async getBudgetByProgrammeId(programmeId: string): Promise<ProgrammeBudget | null> {
    const found = inMemoryBudgets.find((b) => b.programmeId === programmeId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async saveBudget(budget: ProgrammeBudget): Promise<ProgrammeBudget> {
    const idx = inMemoryBudgets.findIndex((b) => b.budgetId === budget.budgetId || b.programmeId === budget.programmeId);
    if (idx >= 0) {
      inMemoryBudgets[idx] = budget;
    } else {
      inMemoryBudgets.push(budget);
    }
    return JSON.parse(JSON.stringify(budget));
  },
};
