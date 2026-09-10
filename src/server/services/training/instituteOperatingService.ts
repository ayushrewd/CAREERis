// ==============================================================================
// CAREERIS INSTITUTE OPERATING SERVICE
// Institute Profiles, 10-Dimension Health Scorecards & Explainability
// ==============================================================================

import { trainingInstituteRepository } from "@/server/repositories/trainingInstituteRepository";
import { TrainingInstituteProfile, TrainingInstituteType } from "@/types/trainingEcosystem";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const instituteOperatingService = {
  async getAllInstitutes(params?: {
    type?: TrainingInstituteType;
    stateCode?: string;
    districtId?: string;
    search?: string;
  }): Promise<TrainingInstituteProfile[]> {
    return trainingInstituteRepository.findAll(params);
  },

  async getInstituteById(id: string): Promise<TrainingInstituteProfile | null> {
    return trainingInstituteRepository.findById(id);
  },

  async getInstituteScorecard(id: string) {
    const inst = await trainingInstituteRepository.findById(id);
    if (!inst) return null;

    const whyIsThisScoreRanked = {
      marketRelevance: {
        score: inst.componentScores.marketRelevance,
        explanation: `${inst.componentScores.marketRelevance}% alignment between active course syllabi and regional ${inst.clusterName || "Chakan-Talegaon"} industrial cluster requisitions.`,
      },
      seatUtilization: {
        score: inst.componentScores.seatUtilization,
        explanation: `${inst.totalEnrolledStudents} enrolled out of ${inst.totalSanctionedSeats} sanctioned seats (${Math.round((inst.totalEnrolledStudents / Math.max(1, inst.totalSanctionedSeats)) * 100)}% utilization).`,
      },
      trainerAdequacy: {
        score: inst.componentScores.trainerAdequacy,
        explanation: `${inst.totalActiveTrainers} active trainers across ${inst.activeCoursesCount} courses.`,
      },
      equipmentReadiness: {
        score: inst.componentScores.equipmentReadiness,
        explanation: `${inst.totalLabsCount} technical labs audited for operational uptime.`,
      },
      placementPerformance: {
        score: inst.componentScores.placementPerformance,
        explanation: `${inst.averagePlacementRatePercentage}% 6-month placement conversion for Skill Passport certified candidates.`,
      },
    };

    return {
      institute: inst,
      overallHealthScore: inst.overallHealthScore,
      healthClassification: inst.healthClassification,
      componentScores: inst.componentScores,
      whyIsThisScoreRanked,
      lastAuditedAt: inst.lastAuditedAt,
      confidenceScore: inst.confidenceScore,
    };
  },
};
