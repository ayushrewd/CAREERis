// ==============================================================================
// CAREERIS TRAINING REQUEST MARKETPLACE SERVICE
// Employer-Initiated Training Demands & Provider Capacity Matching
// ==============================================================================

import { trainingOperationsRepository } from "@/server/repositories/trainingOperationsRepository";
import { TrainingDemandRequestRecord } from "@/types/trainingOperations";

export const trainingRequestMarketplaceService = {
  async getTrainingRequests(): Promise<TrainingDemandRequestRecord[]> {
    return trainingOperationsRepository.getTrainingRequests();
  },

  async createTrainingRequest(req: Partial<TrainingDemandRequestRecord>): Promise<TrainingDemandRequestRecord> {
    return trainingOperationsRepository.createTrainingRequest(req);
  },

  async submitProviderResponse(requestId: string, response: any): Promise<TrainingDemandRequestRecord | null> {
    return trainingOperationsRepository.addProviderResponse(requestId, response);
  },
};
