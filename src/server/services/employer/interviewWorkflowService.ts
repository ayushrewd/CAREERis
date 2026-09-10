// ==============================================================================
// CAREERIS INTERVIEW WORKFLOW SERVICE
// Time-Zone Safe Scheduling & Structured Evaluation Rubrics
// ==============================================================================

import { interviewRepository } from "@/server/repositories/interviewRepository";
import { recruitmentPipelineRepository } from "@/server/repositories/recruitmentPipelineRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { InterviewRecordDetail, InterviewStatus } from "@/types/employerIntelligence";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const interviewWorkflowService = {
  async getInterviews(params?: {
    requisitionId?: string;
    candidateId?: string;
    interviewerId?: string;
    status?: InterviewStatus;
  }): Promise<InterviewRecordDetail[]> {
    return interviewRepository.findAll(params);
  },

  async getInterviewById(id: string): Promise<InterviewRecordDetail | null> {
    return interviewRepository.findById(id);
  },

  async scheduleInterview(
    data: Omit<InterviewRecordDetail, "id" | "status" | "feedback">,
    auth: RequestAuthContext
  ): Promise<InterviewRecordDetail> {
    const created = await interviewRepository.create({
      ...data,
      status: "SCHEDULED",
    });

    // Update Pipeline stage
    await recruitmentPipelineRepository.updateStage(data.applicationId, "INTERVIEW_SCHEDULED");

    // Send Candidate Notification
    await notificationRepository.create({
      userId: data.candidateId,
      type: "INTERVIEW",
      title: `Interview Scheduled: ${data.jobTitle}`,
      message: `Round ${data.roundNumber} (${data.roundName}) scheduled for ${new Date(data.scheduledAt).toLocaleString("en-IN")}.`,
      actionUrl: `/candidate/applications`,
    });

    // Audit Log
    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "INTERVIEW_SCHEDULED",
      entity: "Interview",
      entityId: created.id,
      details: {
        applicationId: data.applicationId,
        candidateId: data.candidateId,
        roundNumber: data.roundNumber,
        scheduledAt: data.scheduledAt,
      },
    });

    return created;
  },

  async submitFeedback(
    interviewId: string,
    feedback: NonNullable<InterviewRecordDetail["feedback"]>,
    auth: RequestAuthContext
  ): Promise<InterviewRecordDetail | null> {
    const updated = await interviewRepository.submitFeedback(interviewId, {
      ...feedback,
      submittedAt: new Date().toISOString(),
      submittedBy: auth.fullName,
    });

    if (updated) {
      await recruitmentPipelineRepository.updateStage(updated.applicationId, "INTERVIEW_COMPLETED");

      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "INTERVIEW_FEEDBACK_SUBMITTED",
        entity: "Interview",
        entityId: interviewId,
        details: {
          recommendation: feedback.recommendation,
          overallScore: feedback.overallScore,
          candidateName: updated.candidateName,
        },
      });
    }

    return updated;
  },

  async updateInterviewStatus(
    interviewId: string,
    status: InterviewStatus,
    reason: string | undefined,
    auth: RequestAuthContext
  ): Promise<InterviewRecordDetail | null> {
    const updated = await interviewRepository.updateStatus(interviewId, status, reason);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "INTERVIEW_STATUS_CHANGED",
        entity: "Interview",
        entityId: interviewId,
        details: { newStatus: status, reason },
      });
    }
    return updated;
  },
};
