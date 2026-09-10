// ==============================================================================
// CAREERIS OFFER MANAGEMENT SERVICE
// Offer Drafting, Compensation Governance & Placement Execution
// ==============================================================================

import { offerRepository } from "@/server/repositories/offerRepository";
import { jobRequisitionRepository } from "@/server/repositories/jobRequisitionRepository";
import { recruitmentPipelineRepository } from "@/server/repositories/recruitmentPipelineRepository";
import { careerTimelineRepository } from "@/server/repositories/careerTimelineRepository";
import { employerRepository } from "@/server/repositories/employerRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { OfferRecordDetail, OfferStatus } from "@/types/employerIntelligence";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const offerManagementService = {
  async getOffers(params?: {
    employerId?: string;
    candidateId?: string;
    requisitionId?: string;
    status?: OfferStatus;
  }): Promise<OfferRecordDetail[]> {
    return offerRepository.findAll(params);
  },

  async getOfferById(id: string): Promise<OfferRecordDetail | null> {
    return offerRepository.findById(id);
  },

  async createOffer(
    data: Omit<OfferRecordDetail, "id" | "createdAt" | "updatedAt">,
    auth: RequestAuthContext
  ): Promise<OfferRecordDetail> {
    const offer = await offerRepository.create(data);

    // Update Requisition counts
    const req = await jobRequisitionRepository.findById(data.requisitionId);
    if (req) {
      await jobRequisitionRepository.update(req.id, {
        offeredCount: req.offeredCount + 1,
      });
    }

    // Update Pipeline stage
    await recruitmentPipelineRepository.updateStage(data.applicationId, "OFFERED");

    // Notify Candidate
    await notificationRepository.create({
      userId: data.candidateId,
      type: "APPLICATION_UPDATE",
      title: `Formal Offer Extended: ${data.employerName}`,
      message: `${data.employerName} has extended an employment offer for ${data.roleTitle}.`,
      actionUrl: `/candidate/applications`,
    });

    // Record Milestone
    await careerTimelineRepository.create({
      candidateId: data.candidateId,
      eventType: "OFFER_RECEIVED",
      title: `Offer Received: ${data.roleTitle}`,
      description: `Formal employment offer from ${data.employerName} with joining date ${data.joiningDate}.`,
      entityId: offer.id,
      eventDate: new Date().toISOString().split("T")[0],
    });

    // Audit Log
    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "OFFER_CREATED",
      entity: "Offer",
      entityId: offer.id,
      details: {
        candidateName: data.candidateName,
        roleTitle: data.roleTitle,
        annualCompensationINR: data.annualCompensationINR,
      },
    });

    return offer;
  },

  async respondToOffer(
    offerId: string,
    params: {
      status: "ACCEPTED" | "REJECTED";
      rejectionReason?: string;
      auth: RequestAuthContext;
    }
  ): Promise<OfferRecordDetail | null> {
    const updated = await offerRepository.updateStatus(offerId, params.status, {
      candidateResponseAt: new Date().toISOString(),
      rejectionReason: params.rejectionReason,
    });

    if (!updated) return null;

    if (params.status === "ACCEPTED") {
      // 1. Update Requisition
      const req = await jobRequisitionRepository.findById(updated.requisitionId);
      if (req) {
        await jobRequisitionRepository.update(req.id, {
          hiredCount: req.hiredCount + 1,
          filledPositions: req.filledPositions + 1,
        });
      }

      // 2. Update Pipeline
      await recruitmentPipelineRepository.updateStage(updated.applicationId, "HIRED");

      // 3. Record Placement in Employer Repo
      await employerRepository.saveFeedback({
        candidateId: updated.candidateId,
        candidateName: updated.candidateName,
        jobRole: updated.roleTitle,
        hiredAt: new Date().toISOString(),
        performanceScore: 92,
        observedGaps: [],
        feedbackText: `Candidate successfully onboarded as ${updated.roleTitle}.`,
      });

      // 4. Record Timeline Milestone
      await careerTimelineRepository.create({
        candidateId: updated.candidateId,
        eventType: "EMPLOYMENT_STARTED",
        title: `Placed at ${updated.employerName}`,
        description: `Commenced role as ${updated.roleTitle}. Verified Skill Passport closed-loop placement complete.`,
        entityId: updated.id,
        eventDate: new Date().toISOString().split("T")[0],
      });

      // 5. Notify Employer
      await notificationRepository.create({
        userId: updated.employerId,
        type: "APPLICATION_UPDATE",
        title: `Offer Accepted: ${updated.candidateName}`,
        message: `${updated.candidateName} has accepted the offer for ${updated.roleTitle}.`,
        actionUrl: `/employer/offers`,
      });
    }

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: params.status === "ACCEPTED" ? "OFFER_ACCEPTED" : "OFFER_REJECTED",
      entity: "Offer",
      entityId: offerId,
      details: { status: params.status, rejectionReason: params.rejectionReason },
    });

    return updated;
  },
};
