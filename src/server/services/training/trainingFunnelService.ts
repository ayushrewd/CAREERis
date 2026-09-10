// ==============================================================================
// CAREERIS TRAINING FUNNEL & OUTCOME INTELLIGENCE SERVICE
// 9-Stage Funnel Conversion, Drop-off Analysis, Skill Verification & Market Fit
// ==============================================================================

import { trainingFunnelRepository } from "@/server/repositories/trainingFunnelRepository";
import { TrainingFunnelStage, CourseMarketFitScore } from "@/types/trainingEcosystem";

export const trainingFunnelService = {
  async getFunnelStages(): Promise<TrainingFunnelStage[]> {
    return trainingFunnelRepository.getFunnelStages();
  },

  async getDropOffAnalysis() {
    const stages = await this.getFunnelStages();
    const majorDropOffs = stages.filter((s) => s.dropOffCount > 50000);

    return {
      totalInterested: stages[0].volume,
      totalPlaced: stages[stages.length - 1].volume,
      overallFunnelConversionPercentage: Math.round(
        (stages[stages.length - 1].volume / stages[0].volume) * 100
      ),
      majorLeakageStages: majorDropOffs.map((d) => ({
        stageName: d.stageName,
        dropOffCount: d.dropOffCount,
        dropOffRatePercentage: d.dropOffRatePercentage,
        primaryReason: d.primaryLeakageReason,
      })),
      recommendedIntervention:
        "Introduce subsidized travel stipends for rural candidates and automated Skill Passport portfolio syncing to reduce drop-offs at Enrollment and Verification stages.",
    };
  },

  async getCourseMarketFitScore(courseId: string): Promise<CourseMarketFitScore | null> {
    return trainingFunnelRepository.getMarketFitScoreByCourseId(courseId);
  },

  async getAllMarketFitScores(): Promise<CourseMarketFitScore[]> {
    return trainingFunnelRepository.getAllMarketFitScores();
  },
};
