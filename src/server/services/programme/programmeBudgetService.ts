// ==============================================================================
// CAREERIS PROGRAMME BUDGET SERVICE
// Multi-Tier Funding, Variances, Burn Rates & Outcome-Per-Rupee Analysis
// ==============================================================================

import { programmeBudgetRepository } from "@/server/repositories/programmeBudgetRepository";
import { ProgrammeBudget } from "@/types/programmeOperations";

export const programmeBudgetService = {
  async getAllBudgets(): Promise<ProgrammeBudget[]> {
    return programmeBudgetRepository.getAllBudgets();
  },

  async getBudgetByProgrammeId(programmeId: string): Promise<ProgrammeBudget | null> {
    return programmeBudgetRepository.getBudgetByProgrammeId(programmeId);
  },

  async getBudgetSummary(): Promise<{
    totalAllocatedINR: number;
    totalCommittedINR: number;
    totalReleasedINR: number;
    totalUtilizedINR: number;
    overallUtilizationPercentage: number;
    programmeCount: number;
  }> {
    const budgets = await this.getAllBudgets();
    let totalAllocatedINR = 0;
    let totalCommittedINR = 0;
    let totalReleasedINR = 0;
    let totalUtilizedINR = 0;

    for (const b of budgets) {
      totalAllocatedINR += b.allocatedAmountINR;
      totalCommittedINR += b.committedAmountINR;
      totalReleasedINR += b.releasedAmountINR;
      totalUtilizedINR += b.utilizedAmountINR;
    }

    const overallUtilizationPercentage =
      totalAllocatedINR > 0 ? Number(((totalUtilizedINR / totalAllocatedINR) * 100).toFixed(1)) : 0;

    return {
      totalAllocatedINR,
      totalCommittedINR,
      totalReleasedINR,
      totalUtilizedINR,
      overallUtilizationPercentage,
      programmeCount: budgets.length,
    };
  },
};
