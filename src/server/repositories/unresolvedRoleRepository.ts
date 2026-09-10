import { UnresolvedRoleRecord } from "@/types/intelligence";

let inMemoryUnresolvedRoles: UnresolvedRoleRecord[] = [
  {
    id: "unres-role-01",
    rawTitle: "ADAS Hardware-in-the-Loop Test Pilot",
    normalizedTitle: "adas hardware in the loop test pilot",
    context: "Requisition from Mahindra Research Valley Chennai",
    sourceEntity: "JOB_POSTING",
    suggestedCanonicalRoleId: "role-bms-lead",
    confidence: 0.65,
    status: "REVIEW_REQUIRED",
    createdAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "unres-role-02",
    rawTitle: "Cobot Workcell Safety Auditor",
    normalizedTitle: "cobot workcell safety auditor",
    context: "Syllabus submission from NTTF Electronics City",
    sourceEntity: "CURRICULUM",
    suggestedCanonicalRoleId: "role-auto-specialist",
    confidence: 0.58,
    status: "UNRESOLVED",
    createdAt: "2026-02-26T12:00:00Z",
    updatedAt: "2026-02-26T12:00:00Z",
  },
];

export const unresolvedRoleRepository = {
  async findAll(params?: { status?: string; page?: number; pageSize?: number }): Promise<{ items: UnresolvedRoleRecord[]; total: number }> {
    let list = [...inMemoryUnresolvedRoles];
    if (params?.status) {
      list = list.filter((r) => r.status === params.status);
    }
    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    return {
      items: list.slice((page - 1) * pageSize, page * pageSize),
      total,
    };
  },

  async create(data: Omit<UnresolvedRoleRecord, "id" | "createdAt" | "updatedAt">): Promise<UnresolvedRoleRecord> {
    const newRecord: UnresolvedRoleRecord = {
      ...data,
      id: `unres-role-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryUnresolvedRoles.unshift(newRecord);
    return newRecord;
  },

  async updateStatus(id: string, status: any, suggestedCanonicalRoleId?: string): Promise<UnresolvedRoleRecord | null> {
    const index = inMemoryUnresolvedRoles.findIndex((r) => r.id === id);
    if (index === -1) return null;
    inMemoryUnresolvedRoles[index] = {
      ...inMemoryUnresolvedRoles[index],
      status,
      suggestedCanonicalRoleId: suggestedCanonicalRoleId || inMemoryUnresolvedRoles[index].suggestedCanonicalRoleId,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryUnresolvedRoles[index];
  },
};
