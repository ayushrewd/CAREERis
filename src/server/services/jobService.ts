import { jobRepository } from "@/server/repositories/jobRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";
import { Job } from "@/types";

export const jobService = {
  async getJobs(params: {
    search?: string;
    state?: string;
    district?: string;
    jobType?: string;
    minSalary?: number;
    skillId?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) {
    return jobRepository.findAll(params);
  },

  async getJobById(id: string) {
    return jobRepository.findById(id);
  },

  async createJob(params: {
    data: Omit<Job, "id" | "createdAt">;
    auth: RequestAuthContext;
  }): Promise<Job> {
    const newJob = await jobRepository.create(params.data);

    // Broadcast notification to candidates
    await notificationRepository.create({
      userId: "user-cand-01",
      type: "JOB_MATCH",
      title: `New Requisition: ${newJob.title}`,
      message: `${newJob.companyName} is hiring in ${newJob.district}, ${newJob.state}.`,
      actionUrl: `/candidate/jobs/${newJob.id}`,
    });

    // Record Audit Event
    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "JOB_CREATED",
      entity: "Job",
      entityId: newJob.id,
      details: {
        title: newJob.title,
        companyName: newJob.companyName,
        district: newJob.district,
        salaryMin: newJob.salaryRangeINR.min,
      },
    });

    return newJob;
  },
};
