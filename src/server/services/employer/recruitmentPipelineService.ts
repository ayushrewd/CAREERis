// ==============================================================================
// CAREERIS RECRUITMENT PIPELINE SERVICE
// 11-Stage Pipeline State Machine, Candidate Tagging & Bulk Actions
// ==============================================================================

import { recruitmentPipelineRepository } from "@/server/repositories/recruitmentPipelineRepository";
import { applicationRepository } from "@/server/repositories/applicationRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { PipelineCandidateItem, RecruitmentPipelineStage } from "@/types/employerIntelligence";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const recruitmentPipelineService = {
  async getPipelineCandidates(params?: {
    requisitionId?: string;
    stage?: RecruitmentPipelineStage;
    search?: string;
  }): Promise<PipelineCandidateItem[]> {
    return recruitmentPipelineRepository.findAll(params);
  },

  async updateCandidateStage(
    applicationId: string,
    newStage: RecruitmentPipelineStage,
    notes: string | undefined,
    auth: RequestAuthContext
  ): Promise<PipelineCandidateItem | null> {
    const updated = await recruitmentPipelineRepository.updateStage(applicationId, newStage);
    if (!updated) return null;

    // Sync with canonical application repository
    const canonicalStage =
      newStage === "ASSESSMENT_COMPLETED" ? "ASSESSMENT_REQUESTED" :
      newStage === "INTERVIEW_COMPLETED" ? "INTERVIEW_SCHEDULED" :
      newStage;
    await applicationRepository.updateStage(applicationId, canonicalStage as any, notes);

    // Notify Candidate
    await notificationRepository.create({
      userId: updated.candidateId,
      type: "APPLICATION_UPDATE",
      title: `Application Update: ${newStage.replace(/_/g, " ")}`,
      message: `Your application for ${updated.jobTitle} has progressed to ${newStage.replace(/_/g, " ")}.`,
      actionUrl: `/candidate/applications`,
    });

    // Audit Event
    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "CANDIDATE_PIPELINE_STAGE_UPDATED",
      entity: "RecruitmentPipeline",
      entityId: applicationId,
      details: { newStage, candidateId: updated.candidateId, notes },
    });

    return updated;
  },

  async tagCandidate(applicationId: string, tag: string, auth: RequestAuthContext): Promise<PipelineCandidateItem | null> {
    const updated = await recruitmentPipelineRepository.addTag(applicationId, tag);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "CANDIDATE_TAGGED",
        entity: "RecruitmentPipeline",
        entityId: applicationId,
        details: { tag },
      });
    }
    return updated;
  },

  async rateCandidate(applicationId: string, rating: number, auth: RequestAuthContext): Promise<PipelineCandidateItem | null> {
    const updated = await recruitmentPipelineRepository.updateRating(applicationId, rating);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "CANDIDATE_RATED",
        entity: "RecruitmentPipeline",
        entityId: applicationId,
        details: { rating },
      });
    }
    return updated;
  },

  async executeBulkAction(
    params: {
      applicationIds: string[];
      actionType: "SHORTLIST" | "REJECT" | "INVITE_ASSESSMENT" | "ADD_TAG" | "ASSIGN_RECRUITER";
      payload?: { tag?: string; recruiterName?: string; note?: string };
      auth: RequestAuthContext;
    }
  ): Promise<{ successfulCount: number; failedCount: number; errors: string[] }> {
    let successfulCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const appId of params.applicationIds) {
      try {
        if (params.actionType === "SHORTLIST") {
          await this.updateCandidateStage(appId, "SHORTLISTED", params.payload?.note, params.auth);
        } else if (params.actionType === "REJECT") {
          await this.updateCandidateStage(appId, "REJECTED", params.payload?.note, params.auth);
        } else if (params.actionType === "INVITE_ASSESSMENT") {
          await this.updateCandidateStage(appId, "ASSESSMENT_REQUESTED", params.payload?.note, params.auth);
        } else if (params.actionType === "ADD_TAG" && params.payload?.tag) {
          await this.tagCandidate(appId, params.payload.tag, params.auth);
        }
        successfulCount++;
      } catch (err: any) {
        failedCount++;
        errors.push(`Failed for ${appId}: ${err.message}`);
      }
    }

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "RECRUITMENT_BULK_ACTION_EXECUTED",
      entity: "RecruitmentPipeline",
      details: {
        actionType: params.actionType,
        totalRequested: params.applicationIds.length,
        successfulCount,
        failedCount,
      },
    });

    return { successfulCount, failedCount, errors };
  },
};
