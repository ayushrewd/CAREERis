// ==============================================================================
// CAREERIS TRAINING PARTNERSHIP SERVICE
// Industry-Academia CoE Partnerships & Post-Hiring Evidence Fusion
// ==============================================================================

import { trainingPartnershipRepository } from "@/server/repositories/trainingPartnershipRepository";
import { employerRepository } from "@/server/repositories/employerRepository";
import { TrainingPartnershipRecord, PartnershipStatus } from "@/types/employerIntelligence";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const trainingPartnershipService = {
  async getPartnerships(params?: {
    employerId?: string;
    trainingProviderId?: string;
    status?: PartnershipStatus;
  }): Promise<TrainingPartnershipRecord[]> {
    return trainingPartnershipRepository.findAll(params);
  },

  async getPartnershipById(id: string): Promise<TrainingPartnershipRecord | null> {
    return trainingPartnershipRepository.findById(id);
  },

  async createPartnership(
    data: Omit<TrainingPartnershipRecord, "id">,
    auth: RequestAuthContext
  ): Promise<TrainingPartnershipRecord> {
    const created = await trainingPartnershipRepository.create(data);

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "TRAINING_PARTNERSHIP_CREATED",
      entity: "TrainingPartnership",
      entityId: created.id,
      details: {
        employerName: data.employerName,
        trainingProviderName: data.trainingProviderName,
        partnershipType: data.partnershipType,
      },
    });

    return created;
  },

  async updatePartnershipStatus(
    id: string,
    status: PartnershipStatus,
    auth: RequestAuthContext
  ): Promise<TrainingPartnershipRecord | null> {
    const updated = await trainingPartnershipRepository.updateStatus(id, status);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "TRAINING_PARTNERSHIP_STATUS_CHANGED",
        entity: "TrainingPartnership",
        entityId: id,
        details: { newStatus: status },
      });
    }
    return updated;
  },

  async submitPostHireFeedback(
    params: {
      candidateId: string;
      candidateName: string;
      jobRole: string;
      performanceScore: number;
      observedGaps: string[];
      feedbackText: string;
      auth: RequestAuthContext;
    }
  ) {
    const rec = await employerRepository.saveFeedback({
      candidateId: params.candidateId,
      candidateName: params.candidateName,
      jobRole: params.jobRole,
      hiredAt: new Date().toISOString(),
      performanceScore: params.performanceScore,
      observedGaps: params.observedGaps,
      feedbackText: params.feedbackText,
    });

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "POST_HIRE_FEEDBACK_SUBMITTED",
      entity: "PlacementFeedback",
      entityId: rec.id,
      details: {
        candidateName: params.candidateName,
        jobRole: params.jobRole,
        performanceScore: params.performanceScore,
      },
    });

    return rec;
  },
};
