// ==============================================================================
// CAREERIS TRAINING PARTNERSHIP REPOSITORY
// Industry-Academia MoUs & Talent Cohorts
// ==============================================================================

import { TrainingPartnershipRecord, PartnershipStatus } from "@/types/employerIntelligence";
import { CANONICAL_TRAINING_PARTNERSHIPS } from "@/data/canonicalTrainingPartnershipsData";

let inMemoryPartnerships: TrainingPartnershipRecord[] = JSON.parse(JSON.stringify(CANONICAL_TRAINING_PARTNERSHIPS));

export const trainingPartnershipRepository = {
  async findAll(params?: {
    employerId?: string;
    trainingProviderId?: string;
    status?: PartnershipStatus;
  }): Promise<TrainingPartnershipRecord[]> {
    let list = [...inMemoryPartnerships];
    if (params?.employerId) {
      list = list.filter((p) => p.employerId.toLowerCase() === params.employerId!.toLowerCase());
    }
    if (params?.trainingProviderId) {
      list = list.filter((p) => p.trainingProviderId.toLowerCase() === params.trainingProviderId!.toLowerCase());
    }
    if (params?.status) {
      list = list.filter((p) => p.status === params.status);
    }
    return list;
  },

  async findById(id: string): Promise<TrainingPartnershipRecord | null> {
    const found = inMemoryPartnerships.find((p) => p.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<TrainingPartnershipRecord, "id">): Promise<TrainingPartnershipRecord> {
    const newPart: TrainingPartnershipRecord = {
      ...data,
      id: `part-${Date.now().toString(36)}`,
    };
    inMemoryPartnerships.unshift(newPart);
    return JSON.parse(JSON.stringify(newPart));
  },

  async updateStatus(id: string, status: PartnershipStatus): Promise<TrainingPartnershipRecord | null> {
    const item = inMemoryPartnerships.find((p) => p.id === id);
    if (!item) return null;
    item.status = status;
    return item;
  },
};
