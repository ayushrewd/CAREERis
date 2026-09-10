// ==============================================================================
// CAREERIS GOVERNMENT INTERVENTION REPOSITORY
// 11-Stage Full Lifecycle Management, Baseline/Target/Actual Tracking & Audit
// ==============================================================================

import {
  GovernmentIntervention,
  GovernmentInterventionStatus,
  GovernmentScopeType,
} from "@/types/governmentIntelligence";
import { CANONICAL_GOVERNMENT_INTERVENTIONS } from "@/data/canonicalGovernmentInterventionsData";

let inMemoryInterventions: GovernmentIntervention[] = JSON.parse(
  JSON.stringify(CANONICAL_GOVERNMENT_INTERVENTIONS)
);

export const governmentInterventionRepository = {
  async findAll(params?: {
    status?: GovernmentInterventionStatus;
    scope?: GovernmentScopeType;
    stateCode?: string;
    districtId?: string;
    programId?: string;
    targetSkillId?: string;
  }): Promise<GovernmentIntervention[]> {
    let list = [...inMemoryInterventions];

    if (params?.status) {
      list = list.filter((i) => i.status === params.status);
    }
    if (params?.scope) {
      list = list.filter((i) => i.geographyScope === params.scope);
    }
    if (params?.stateCode) {
      list = list.filter((i) => i.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtId) {
      list = list.filter((i) => i.districtId.toLowerCase() === params.districtId!.toLowerCase());
    }
    if (params?.programId) {
      list = list.filter((i) => i.programId === params.programId);
    }
    if (params?.targetSkillId) {
      list = list.filter((i) => i.targetSkillId === params.targetSkillId);
    }

    return list;
  },

  async findById(id: string): Promise<GovernmentIntervention | null> {
    const found = inMemoryInterventions.find((i) => i.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<GovernmentIntervention, "id">): Promise<GovernmentIntervention> {
    const newRecord: GovernmentIntervention = {
      ...data,
      id: `intv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryInterventions.unshift(newRecord);
    return newRecord;
  },

  async updateStatus(
    id: string,
    newStatus: GovernmentInterventionStatus,
    actionBy: string,
    notes?: string,
    actualValue?: number
  ): Promise<GovernmentIntervention | null> {
    const index = inMemoryInterventions.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const item = inMemoryInterventions[index];
    const prevStatus = item.status;
    item.status = newStatus;

    if (actualValue !== undefined) {
      item.actualValue = actualValue;
      if (item.targetValue > 0) {
        item.achievementPercentage = Math.min(
          100,
          Math.round((actualValue / item.targetValue) * 100)
        );
        item.variancePercentage = Math.max(0, 100 - item.achievementPercentage);
      }
    }

    if (newStatus === "COMPLETED" || newStatus === "EVALUATED") {
      item.actualCompletionDate = new Date().toISOString().split("T")[0];
    }

    item.approvalChain.push({
      stage: newStatus,
      actedBy: actionBy,
      actedAt: new Date().toISOString(),
      notes: notes || `Transitioned from ${prevStatus} to ${newStatus}.`,
    });

    return item;
  },
};
