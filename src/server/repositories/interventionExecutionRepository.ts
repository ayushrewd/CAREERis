// ==============================================================================
// CAREERIS INTERVENTION EXECUTION REPOSITORY
// Intervention Lifecycle, Milestones, Dependency DAG & Priority Scoring
// ==============================================================================

import { InterventionExecution, InterventionMilestone } from "@/types/programmeOperations";
import { CANONICAL_INTERVENTION_EXECUTIONS } from "@/data/canonicalProgrammeOperationsData";

let inMemoryInterventions: InterventionExecution[] = JSON.parse(
  JSON.stringify(CANONICAL_INTERVENTION_EXECUTIONS)
);

export const interventionExecutionRepository = {
  async getAllInterventions(filters?: { stateCode?: string; districtId?: string }): Promise<InterventionExecution[]> {
    let list = inMemoryInterventions;
    if (filters?.stateCode) {
      list = list.filter((i) => i.stateCode === filters.stateCode);
    }
    if (filters?.districtId) {
      list = list.filter((i) => i.districtId === filters.districtId);
    }
    return JSON.parse(JSON.stringify(list));
  },

  async getInterventionById(interventionId: string): Promise<InterventionExecution | null> {
    const found = inMemoryInterventions.find((i) => i.interventionId === interventionId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createIntervention(intervention: InterventionExecution): Promise<InterventionExecution> {
    inMemoryInterventions.push(intervention);
    return JSON.parse(JSON.stringify(intervention));
  },

  async updateMilestone(interventionId: string, milestone: InterventionMilestone): Promise<InterventionExecution | null> {
    const intervention = inMemoryInterventions.find((i) => i.interventionId === interventionId);
    if (!intervention) return null;

    const mIdx = intervention.milestones.findIndex((m) => m.milestoneId === milestone.milestoneId);
    if (mIdx >= 0) {
      intervention.milestones[mIdx] = milestone;
    } else {
      intervention.milestones.push(milestone);
    }
    intervention.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(intervention));
  },
};
