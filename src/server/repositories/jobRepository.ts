import { prisma, isPostgresMode } from "@/server/db/prisma";
import { DEMO_JOBS } from "@/data/demoData";
import { Job } from "@/types";

// In-memory store for development/demo mode
let inMemoryJobs: Job[] = [...DEMO_JOBS];

export const jobRepository = {
  async findAll(params: {
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
  }): Promise<{ items: Job[]; total: number }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    let items = [...inMemoryJobs];

    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (params.state) {
      items = items.filter((j) => j.state.toLowerCase() === params.state?.toLowerCase());
    }
    if (params.district && params.district !== "ALL") {
      items = items.filter((j) => j.district.toLowerCase() === params.district?.toLowerCase());
    }
    if (params.jobType) {
      items = items.filter((j) => j.jobType === params.jobType);
    }
    if (params.minSalary) {
      items = items.filter((j) => j.salaryRangeINR.min >= (params.minSalary || 0));
    }
    if (params.skillId) {
      items = items.filter((j) => j.requiredSkills.some((s) => s.skillId === params.skillId));
    }

    const total = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
    };
  },

  async findById(id: string): Promise<Job | null> {
    const job = inMemoryJobs.find((j) => j.id === id);
    return job || null;
  },

  async create(jobData: Omit<Job, "id" | "createdAt">): Promise<Job> {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      isDemoData: !isPostgresMode(),
    };
    inMemoryJobs = [newJob, ...inMemoryJobs];
    return newJob;
  },

  async update(id: string, updates: Partial<Job>): Promise<Job | null> {
    const index = inMemoryJobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    inMemoryJobs[index] = { ...inMemoryJobs[index], ...updates };
    return inMemoryJobs[index];
  },

  async delete(id: string): Promise<boolean> {
    const initialLength = inMemoryJobs.length;
    inMemoryJobs = inMemoryJobs.filter((j) => j.id !== id);
    return inMemoryJobs.length < initialLength;
  },
};
