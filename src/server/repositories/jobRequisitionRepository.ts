// ==============================================================================
// CAREERIS JOB REQUISITION REPOSITORY
// Requisition Management & Approval Workflow
// ==============================================================================

import { JobRequisition, RequisitionStatus } from "@/types/employerIntelligence";
import { CANONICAL_REQUISITIONS } from "@/data/canonicalRequisitionsData";

let inMemoryRequisitions: JobRequisition[] = JSON.parse(JSON.stringify(CANONICAL_REQUISITIONS));

export const jobRequisitionRepository = {
  async findAll(params?: {
    employerId?: string;
    status?: RequisitionStatus;
    canonicalRoleId?: string;
    district?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: JobRequisition[]; total: number }> {
    let list = [...inMemoryRequisitions];

    if (params?.employerId) {
      list = list.filter((r) => r.employerId.toLowerCase() === params.employerId!.toLowerCase());
    }
    if (params?.status) {
      list = list.filter((r) => r.status === params.status);
    }
    if (params?.canonicalRoleId) {
      list = list.filter((r) => r.canonicalRoleId.toLowerCase() === params.canonicalRoleId!.toLowerCase());
    }
    if (params?.district) {
      list = list.filter((r) => r.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.jobTitle.toLowerCase().includes(q) ||
          r.requisitionNumber.toLowerCase().includes(q) ||
          r.requiredSkills.some((s) => s.skillName.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = list.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async findById(id: string): Promise<JobRequisition | null> {
    const found = inMemoryRequisitions.find((r) => r.id.toLowerCase() === id.toLowerCase() || r.requisitionNumber.toLowerCase() === id.toLowerCase());
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<JobRequisition, "id" | "requisitionNumber" | "createdAt" | "updatedAt">): Promise<JobRequisition> {
    const nextSeq = inMemoryRequisitions.length + 1;
    const prefix = data.employerName.substring(0, 2).toUpperCase();
    const newReq: JobRequisition = {
      ...data,
      id: `req-${Date.now().toString(36)}`,
      requisitionNumber: `REQ-${prefix}-2026-${String(nextSeq).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryRequisitions.unshift(newReq);
    return JSON.parse(JSON.stringify(newReq));
  },

  async update(id: string, updates: Partial<JobRequisition>): Promise<JobRequisition | null> {
    const idx = inMemoryRequisitions.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    inMemoryRequisitions[idx] = {
      ...inMemoryRequisitions[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(inMemoryRequisitions[idx]));
  },

  async updateStatus(
    id: string,
    status: RequisitionStatus,
    approvalEntry?: { stage: "SUBMITTED" | "APPROVED" | "RETURNED" | "REJECTED"; actedBy: string; actedAt: string; comments?: string }
  ): Promise<JobRequisition | null> {
    const idx = inMemoryRequisitions.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    inMemoryRequisitions[idx].status = status;
    inMemoryRequisitions[idx].updatedAt = new Date().toISOString();
    if (approvalEntry) {
      inMemoryRequisitions[idx].approvalHistory.push(approvalEntry);
    }
    return JSON.parse(JSON.stringify(inMemoryRequisitions[idx]));
  },

  async delete(id: string): Promise<boolean> {
    const prevLen = inMemoryRequisitions.length;
    inMemoryRequisitions = inMemoryRequisitions.filter((r) => r.id.toLowerCase() !== id.toLowerCase());
    return inMemoryRequisitions.length < prevLen;
  },
};
