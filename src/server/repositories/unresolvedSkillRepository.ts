import { UnresolvedSkillRecord, UnresolvedSkillStatus } from "@/types/skills";

let inMemoryUnresolved: UnresolvedSkillRecord[] = [
  {
    id: "unres-01",
    rawText: "Automotive Over-The-Air (OTA) Flashing",
    normalizedText: "automotive over the air ota flashing",
    context: "Job posting for Connected Vehicle Firmware Lead at Tata Motors EV",
    sourceEntity: "JOB_POSTING",
    sourceEntityId: "job-01",
    confidence: 0.45,
    status: "REVIEW_REQUIRED",
    createdAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "unres-02",
    rawText: "Cobot Path Planning (Universal Robots)",
    normalizedText: "cobot path planning universal robots",
    context: "ITI Aundh Advanced Mechatronics Lab Bench Syllabus",
    sourceEntity: "COURSE_SYLLABUS",
    sourceEntityId: "course-02",
    confidence: 0.6,
    status: "UNRESOLVED",
    createdAt: "2026-02-26T14:30:00Z",
    updatedAt: "2026-02-26T14:30:00Z",
  },
];

export const unresolvedSkillRepository = {
  async findAll(params?: { status?: UnresolvedSkillStatus; page?: number; pageSize?: number }): Promise<{ items: UnresolvedSkillRecord[]; total: number }> {
    let list = [...inMemoryUnresolved];
    if (params?.status) {
      list = list.filter((u) => u.status === params.status);
    }
    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = list.slice((page - 1) * pageSize, page * pageSize);
    return { items: paginated, total };
  },

  async findById(id: string): Promise<UnresolvedSkillRecord | null> {
    const item = inMemoryUnresolved.find((u) => u.id === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },

  async create(data: Omit<UnresolvedSkillRecord, "id" | "createdAt" | "updatedAt">): Promise<UnresolvedSkillRecord> {
    const newItem: UnresolvedSkillRecord = {
      ...data,
      id: `unres-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryUnresolved.unshift(newItem);
    return newItem;
  },

  async recordUnresolved(params: { rawSkillName: string; source: string; employerName?: string }): Promise<UnresolvedSkillRecord> {
    return this.create({
      rawText: params.rawSkillName,
      normalizedText: params.rawSkillName.toLowerCase().trim(),
      context: `Submitted from ${params.source} by ${params.employerName || "Employer"}`,
      sourceEntity: "JOB_POSTING",
      confidence: 0.5,
      status: "UNRESOLVED",
    });
  },

  async updateStatus(id: string, status: UnresolvedSkillStatus, resolvedSkillId?: string): Promise<UnresolvedSkillRecord | null> {
    const index = inMemoryUnresolved.findIndex((u) => u.id === id);
    if (index === -1) return null;

    inMemoryUnresolved[index] = {
      ...inMemoryUnresolved[index],
      status,
      resolvedSkillId: resolvedSkillId || inMemoryUnresolved[index].resolvedSkillId,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryUnresolved[index];
  },
};
