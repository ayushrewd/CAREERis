import { employerRepository, PlacementFeedbackRecord, DemandSignalRecord } from "@/server/repositories/employerRepository";
import { applicationRepository } from "@/server/repositories/applicationRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";
import { InterviewRecord } from "@/lib/store/platformStore";

export const employerService = {
  async getCompanies() {
    return employerRepository.findAll();
  },

  async getCompanyById(id: string) {
    return employerRepository.findById(id);
  },

  async scheduleInterview(params: {
    applicationId: string;
    scheduledAt: string;
    durationMinutes: number;
    format: "TECHNICAL_PANEL" | "VIDEO_CALL" | "ON_SITE";
    locationOrLink: string;
    interviewerName: string;
    notes?: string;
    auth: RequestAuthContext;
  }): Promise<InterviewRecord> {
    const app = await applicationRepository.findById(params.applicationId);
    if (!app) {
      throw new Error(`Application not found: ${params.applicationId}`);
    }

    // 1. Create interview record
    const interview = await applicationRepository.createInterview({
      applicationId: app.id,
      candidateId: app.candidateId,
      candidateName: app.candidateName,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      scheduledAt: params.scheduledAt,
      durationMinutes: params.durationMinutes,
      format: params.format,
      locationOrLink: params.locationOrLink,
      interviewerName: params.interviewerName,
      notes: params.notes,
      status: "SCHEDULED",
    });

    // 2. Advance application stage
    await applicationRepository.updateStage(app.id, "INTERVIEW_SCHEDULED", `Interview scheduled for ${params.scheduledAt}`);

    // 3. Dispatch Candidate Notification
    await notificationRepository.create({
      userId: app.candidateId,
      type: "INTERVIEW",
      title: `Interview Scheduled: ${app.jobTitle}`,
      message: `${app.companyName} scheduled a ${params.format.replace(/_/g, " ")} on ${new Date(params.scheduledAt).toLocaleDateString("en-IN")}.`,
      actionUrl: `/candidate/applications`,
    });

    // 4. Audit
    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "INTERVIEW_SCHEDULED",
      entity: "InterviewSchedule",
      entityId: interview.id,
      details: { applicationId: app.id, format: params.format, scheduledAt: params.scheduledAt },
    });

    return interview;
  },

  async submitFeedback(params: {
    data: Omit<PlacementFeedbackRecord, "id" | "submittedAt">;
    auth: RequestAuthContext;
  }): Promise<PlacementFeedbackRecord> {
    const fb = await employerRepository.saveFeedback(params.data);

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "FEEDBACK_SUBMITTED",
      entity: "PlacementFeedback",
      entityId: fb.id,
      details: { candidateName: fb.candidateName, score: fb.performanceScore },
    });

    return fb;
  },

  async submitDemandSignal(params: {
    data: Omit<DemandSignalRecord, "id" | "submittedAt">;
    auth: RequestAuthContext;
  }): Promise<DemandSignalRecord> {
    const ds = await employerRepository.saveDemandSignal(params.data);

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "DEMAND_SIGNAL_SUBMITTED",
      entity: "DemandSignal",
      entityId: ds.id,
      details: { role: ds.jobRole, headcount: ds.headcountDemand, district: ds.district },
    });

    return ds;
  },

  async getDemandSignals() {
    return employerRepository.getDemandSignals();
  },

  async getFeedbacks() {
    return employerRepository.getFeedback();
  },
};
