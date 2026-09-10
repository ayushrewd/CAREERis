import { InterventionRecord, InterventionStatus } from "@/types/decisionIntelligence";
import { CANONICAL_INTERVENTIONS } from "@/data/canonicalInterventionsData";

let inMemoryInterventions: InterventionRecord[] = JSON.parse(JSON.stringify(CANONICAL_INTERVENTIONS));

export const interventionRepository = {
  async findAll(params?: {
    status?: InterventionStatus;
    scope?: string;
    districtId?: string;
    courseId?: string;
  }): Promise<InterventionRecord[]> {
    let list = [...inMemoryInterventions];
    if (params?.status) {
      list = list.filter((i) => i.status === params.status);
    }
    if (params?.scope) {
      list = list.filter((i) => i.scope === params.scope);
    }
    if (params?.districtId) {
      list = list.filter((i) => i.targetDistrictId === params.districtId);
    }
    if (params?.courseId) {
      list = list.filter((i) => i.targetCourseId === params.courseId);
    }
    return list;
  },

  async findById(id: string): Promise<InterventionRecord | null> {
    const found = inMemoryInterventions.find((i) => i.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<InterventionRecord, "id" | "createdAt" | "updatedAt">): Promise<InterventionRecord> {
    const newRecord: InterventionRecord = {
      ...data,
      id: `int-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryInterventions.unshift(newRecord);
    return newRecord;
  },

  async updateStatus(
    id: string,
    status: InterventionStatus,
    approvedBy?: string,
    approvalNotes?: string,
    actualValue?: number
  ): Promise<InterventionRecord | null> {
    const index = inMemoryInterventions.findIndex((i) => i.id === id);
    if (index === -1) return null;

    inMemoryInterventions[index] = {
      ...inMemoryInterventions[index],
      status,
      approvedBy: approvedBy || inMemoryInterventions[index].approvedBy,
      approvalNotes: approvalNotes || inMemoryInterventions[index].approvalNotes,
      actualValue: actualValue !== undefined ? actualValue : inMemoryInterventions[index].actualValue,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryInterventions[index];
  },
};
