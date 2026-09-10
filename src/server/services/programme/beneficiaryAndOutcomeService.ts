// ==============================================================================
// CAREERIS BENEFICIARY & OUTCOME SERVICE
// Privacy-Safe Funnels, Multi-Horizon Retention & Placement Quality
// ==============================================================================

import { programmeOutcomeRepository } from "@/server/repositories/programmeOutcomeRepository";
import { BeneficiaryFunnel } from "@/types/programmeOperations";

export const beneficiaryAndOutcomeService = {
  async getBeneficiaryFunnel(programmeId: string): Promise<BeneficiaryFunnel | null> {
    return programmeOutcomeRepository.getBeneficiaryFunnelByProgrammeId(programmeId);
  },

  async getAllFunnels(): Promise<BeneficiaryFunnel[]> {
    return programmeOutcomeRepository.getAllBeneficiaryFunnels();
  },

  async getNationalOutcomeSummary(): Promise<{
    totalEnrolled: number;
    totalCertified: number;
    totalPlaced: number;
    totalRetained365d: number;
    averagePlacementRatePercentage: number;
    average365dRetentionPercentage: number;
    averageRoleRelevance: number;
  }> {
    const funnels = await this.getAllFunnels();
    let totalEnrolled = 0;
    let totalCertified = 0;
    let totalPlaced = 0;
    let totalRetained365d = 0;
    let weightedRoleRelevance = 0;

    for (const f of funnels) {
      totalEnrolled += f.enrolled;
      totalCertified += f.certified;
      totalPlaced += f.placed;
      totalRetained365d += f.retained365d;
      weightedRoleRelevance += f.placementQuality.roleRelevanceScore * f.placed;
    }

    const averagePlacementRatePercentage =
      totalEnrolled > 0 ? Number(((totalPlaced / totalEnrolled) * 100).toFixed(1)) : 0;
    const average365dRetentionPercentage =
      totalPlaced > 0 ? Number(((totalRetained365d / totalPlaced) * 100).toFixed(1)) : 0;
    const averageRoleRelevance =
      totalPlaced > 0 ? Number((weightedRoleRelevance / totalPlaced).toFixed(1)) : 0;

    return {
      totalEnrolled,
      totalCertified,
      totalPlaced,
      totalRetained365d,
      averagePlacementRatePercentage,
      average365dRetentionPercentage,
      averageRoleRelevance,
    };
  },
};
