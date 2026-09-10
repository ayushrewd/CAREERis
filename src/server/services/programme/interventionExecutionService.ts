// ==============================================================================
// CAREERIS INTERVENTION EXECUTION SERVICE
// Dependency DAGs, Milestone Progression & Explainable Priority Scoring
// ==============================================================================

import { interventionExecutionRepository } from "@/server/repositories/interventionExecutionRepository";
import { InterventionExecution, InterventionMilestone } from "@/types/programmeOperations";

export const interventionExecutionService = {
  async getAllInterventions(filters?: { stateCode?: string; districtId?: string }): Promise<InterventionExecution[]> {
    return interventionExecutionRepository.getAllInterventions(filters);
  },

  async getInterventionById(interventionId: string): Promise<InterventionExecution | null> {
    return interventionExecutionRepository.getInterventionById(interventionId);
  },

  async updateMilestoneProgress(interventionId: string, milestone: InterventionMilestone): Promise<InterventionExecution | null> {
    return interventionExecutionRepository.updateMilestone(interventionId, milestone);
  },

  async getInterventionExplainability(interventionId: string) {
    const intv = await this.getInterventionById(interventionId);
    if (!intv) return null;
    return {
      interventionId: intv.interventionId,
      title: intv.title,
      explainability: intv.explainability,
      dependencies: intv.dependsOnInterventionIds,
      milestones: intv.milestones,
    };
  },
};
