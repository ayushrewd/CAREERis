import { DataIngestionJob, IngestionJobStatus } from "@/types/intelligence";

let inMemoryJobs: DataIngestionJob[] = [
  {
    id: "job-ingest-01",
    sourceId: "src-msde-ncvt",
    sourceName: "MSDE NCVT ITI Seating & Enrollment Registry",
    startedAt: "2026-02-15T08:00:00Z",
    completedAt: "2026-02-15T08:24:00Z",
    status: "COMPLETED",
    recordsReceived: 1250,
    recordsAccepted: 1248,
    recordsRejected: 2,
    recordsUpdated: 340,
    recordsCreated: 908,
    errors: ["District code 'MH-99' unrecognized in 2 legacy records."],
    warnings: ["Missing email in 14 ITI listings, defaulted to state nodal desk."],
    checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    executionMode: "AUTOMATIC",
  },
  {
    id: "job-ingest-02",
    sourceId: "src-jobmarket-aggregator",
    sourceName: "India National Job Market Vacancy Stream",
    startedAt: "2026-02-27T05:00:00Z",
    completedAt: "2026-02-27T05:18:00Z",
    status: "COMPLETED",
    recordsReceived: 4500,
    recordsAccepted: 4420,
    recordsRejected: 80,
    recordsUpdated: 1200,
    recordsCreated: 3220,
    errors: ["80 records dropped due to missing job titles or duplicate UUIDs."],
    warnings: ["120 job posts contained non-canonical skill variants; routed to normalizer."],
    checksum: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    executionMode: "AUTOMATIC",
  },
];

export const ingestionJobRepository = {
  async findAll(params?: { sourceId?: string; status?: IngestionJobStatus; limit?: number }): Promise<DataIngestionJob[]> {
    let list = [...inMemoryJobs];
    if (params?.sourceId) {
      list = list.filter((j) => j.sourceId === params.sourceId);
    }
    if (params?.status) {
      list = list.filter((j) => j.status === params.status);
    }
    const limit = params?.limit || 50;
    return list.slice(0, limit);
  },

  async findById(id: string): Promise<DataIngestionJob | null> {
    const job = inMemoryJobs.find((j) => j.id === id);
    return job ? JSON.parse(JSON.stringify(job)) : null;
  },

  async create(jobData: Omit<DataIngestionJob, "id">): Promise<DataIngestionJob> {
    const newJob: DataIngestionJob = {
      ...jobData,
      id: `job-ingest-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryJobs.unshift(newJob);
    return newJob;
  },

  async update(id: string, updates: Partial<DataIngestionJob>): Promise<DataIngestionJob | null> {
    const index = inMemoryJobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    inMemoryJobs[index] = { ...inMemoryJobs[index], ...updates };
    return inMemoryJobs[index];
  },
};
