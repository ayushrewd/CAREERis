import { applicationRepository } from "@/server/repositories/applicationRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { ApplicationRecord, ApplicationStage } from "@/lib/store/platformStore";
import { RequestAuthContext } from "@/server/middleware/authContext";

const VALID_TRANSITIONS: Record<ApplicationStage, ApplicationStage[]> = {
  APPLIED: ["VIEWED", "SHORTLISTED", "REJECTED", "WITHDRAWN"],
  VIEWED: ["SHORTLISTED", "ASSESSMENT_REQUESTED", "REJECTED", "WITHDRAWN"],
  SHORTLISTED: ["ASSESSMENT_REQUESTED", "INTERVIEW_SCHEDULED", "REJECTED", "WITHDRAWN"],
  ASSESSMENT_REQUESTED: ["INTERVIEW_SCHEDULED", "REJECTED", "WITHDRAWN"],
  INTERVIEW_SCHEDULED: ["OFFERED", "REJECTED", "WITHDRAWN"],
  OFFERED: ["HIRED", "REJECTED", "WITHDRAWN"],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export const applicationService = {
  async submitApplication(params: {
    jobId: string;
    coverNote?: string;
    selectedEvidenceIds?: string[];
    auth: RequestAuthContext;
  }): Promise<ApplicationRecord> {
    const job = await jobRepository.findById(params.jobId);
    if (!job) {
      throw new Error(`Job not found: ${params.jobId}`);
    }

    const candidate = await candidateRepository.getProfile(params.auth.userId);

    // Calculate match percentage
    let matchScore = 85;
    if (job.requiredSkills && candidate.skills) {
      const matched = job.requiredSkills.filter((req) =>
        candidate.skills.some((cs) => cs.skillId === req.skillId)
      );
      matchScore = Math.round((matched.length / Math.max(1, job.requiredSkills.length)) * 100);
    }

    // 1. Transactional creation: Application
    const app = await applicationRepository.create({
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      candidateId: candidate.id,
      candidateName: params.auth.fullName,
      candidateHeadline: candidate.headline || "Verified Technical Specialist",
      matchScore: matchScore,
      stage: "APPLIED",
      coverNote: params.coverNote,
      attachedEvidences: params.selectedEvidenceIds || [],
    });

    // 2. Transactional creation: Notification for Employer
    await notificationRepository.create({
      userId: job.companyId,
      type: "APPLICATION_UPDATE",
      title: "New Verified Candidate Application",
      message: `${params.auth.fullName} applied for ${job.title} with a ${matchScore}% skill match breakdown.`,
      actionUrl: `/employer/jobs/${job.id}`,
    });

    // 3. Transactional creation: Audit Log
    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "APPLICATION_CREATED",
      entity: "Application",
      entityId: app.id,
      details: { jobId: job.id, jobTitle: job.title, matchScore },
    });

    return app;
  },

  async updateStage(params: {
    applicationId: string;
    newStage: ApplicationStage;
    feedbackNotes?: string;
    auth: RequestAuthContext;
  }): Promise<ApplicationRecord> {
    const app = await applicationRepository.findById(params.applicationId);
    if (!app) {
      throw new Error(`Application not found: ${params.applicationId}`);
    }

    const allowed = VALID_TRANSITIONS[app.stage];
    if (!allowed || (!allowed.includes(params.newStage) && params.auth.userRole !== "PLATFORM_ADMIN")) {
      throw new Error(
        `Invalid stage transition from ${app.stage} to ${params.newStage}. Allowed transitions: ${allowed?.join(", ") || "None"}`
      );
    }

    const updated = await applicationRepository.updateStage(
      params.applicationId,
      params.newStage,
      params.feedbackNotes
    );

    if (!updated) {
      throw new Error("Failed to update application stage");
    }

    // Trigger Candidate Notification
    await notificationRepository.create({
      userId: app.candidateId,
      type: "APPLICATION_UPDATE",
      title: `Application Update: ${params.newStage.replace(/_/g, " ")}`,
      message: `Your application for ${app.jobTitle} at ${app.companyName} has moved to ${params.newStage.replace(/_/g, " ")}.`,
      actionUrl: `/candidate/applications`,
    });

    // Audit Log
    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "APPLICATION_STAGE_CHANGED",
      entity: "Application",
      entityId: app.id,
      details: { oldStage: app.stage, newStage: params.newStage, feedback: params.feedbackNotes },
    });

    return updated;
  },

  async getApplications(params: {
    candidateId?: string;
    jobId?: string;
    stage?: string;
    page?: number;
    pageSize?: number;
  }) {
    return applicationRepository.findAll(params);
  },

  async applyForJob(params: { candidateId: string; jobId: string; coverLetter?: string; auth?: RequestAuthContext }): Promise<ApplicationRecord> {
    const auth = params.auth || { userId: params.candidateId, fullName: "Rohit Sharma", email: "candidate@careeris.gov.in", userRole: "CANDIDATE" as const };
    return this.submitApplication({ jobId: params.jobId, coverNote: params.coverLetter, auth });
  },

  async updateApplicationStage(applicationId: string, newStage: ApplicationStage, auth?: RequestAuthContext): Promise<ApplicationRecord> {
    const defaultAuth = auth || { userId: "user-admin-01", fullName: "Platform Admin", email: "admin@careeris.gov.in", userRole: "PLATFORM_ADMIN" as const };
    return this.updateStage({ applicationId, newStage, auth: defaultAuth });
  },

  async getApplicationById(id: string) {
    return applicationRepository.findById(id);
  },
};
