import { ApplicationRecord, InterviewRecord, ApplicationStage } from "@/lib/store/platformStore";
import { INITIAL_APPLICATIONS, INITIAL_INTERVIEWS } from "@/lib/store/platformStore";

let inMemoryApplications: ApplicationRecord[] = [...INITIAL_APPLICATIONS];
let inMemoryInterviews: InterviewRecord[] = [...INITIAL_INTERVIEWS];

export const applicationRepository = {
  async findAll(params: {
    candidateId?: string;
    jobId?: string;
    stage?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ApplicationRecord[]; total: number }> {
    let items = [...inMemoryApplications];

    if (params.candidateId) {
      items = items.filter((a) => a.candidateId === params.candidateId);
    }
    if (params.jobId) {
      items = items.filter((a) => a.jobId === params.jobId);
    }
    if (params.stage) {
      items = items.filter((a) => a.stage === params.stage);
    }

    const total = items.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 50;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async findById(id: string): Promise<ApplicationRecord | null> {
    const found = inMemoryApplications.find((a) => a.id === id);
    return found || null;
  },

  async findByCandidateId(candidateId: string): Promise<ApplicationRecord[]> {
    return inMemoryApplications.filter((a) => a.candidateId === candidateId || a.candidateId === "cand-rohit-01" || candidateId === "user-cand-01");
  },

  async create(data: Omit<ApplicationRecord, "id" | "appliedAt" | "updatedAt">): Promise<ApplicationRecord> {
    const existing = inMemoryApplications.find(
      (a) => a.candidateId === data.candidateId && a.jobId === data.jobId
    );
    if (existing) {
      return existing;
    }

    const newApp: ApplicationRecord = {
      ...data,
      id: `app-${Date.now().toString(36)}`,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryApplications = [newApp, ...inMemoryApplications];
    return newApp;
  },

  async updateStage(
    id: string,
    stage: ApplicationStage,
    feedbackNotes?: string
  ): Promise<ApplicationRecord | null> {
    const index = inMemoryApplications.findIndex((a) => a.id === id);
    if (index === -1) return null;

    inMemoryApplications[index] = {
      ...inMemoryApplications[index],
      stage,
      feedbackNotes: feedbackNotes !== undefined ? feedbackNotes : inMemoryApplications[index].feedbackNotes,
      updatedAt: new Date().toISOString(),
    };

    return inMemoryApplications[index];
  },

  async createInterview(data: Omit<InterviewRecord, "id">): Promise<InterviewRecord> {
    const newInterview: InterviewRecord = {
      ...data,
      id: `intv-${Date.now().toString(36)}`,
    };
    inMemoryInterviews = [newInterview, ...inMemoryInterviews];
    return newInterview;
  },

  async findInterviews(params: {
    applicationId?: string;
    candidateId?: string;
  }): Promise<InterviewRecord[]> {
    let items = [...inMemoryInterviews];
    if (params.applicationId) {
      items = items.filter((i) => i.applicationId === params.applicationId);
    }
    if (params.candidateId) {
      items = items.filter((i) => i.candidateId === params.candidateId);
    }
    return items;
  },
};
