// ==============================================================================
// CAREERIS WORKFORCE PLAN REPOSITORY
// Workforce Headcount & Skill Forecasting Persistence
// ==============================================================================

import { WorkforcePlan } from "@/types/employerIntelligence";
import { CANONICAL_WORKFORCE_PLANS } from "@/data/canonicalWorkforcePlansData";

let inMemoryPlans: WorkforcePlan[] = JSON.parse(JSON.stringify(CANONICAL_WORKFORCE_PLANS));

export const workforcePlanRepository = {
  async findAll(params?: { employerId?: string; status?: "DRAFT" | "ACTIVE" | "COMPLETED" }): Promise<WorkforcePlan[]> {
    let list = [...inMemoryPlans];
    if (params?.employerId) {
      list = list.filter((p) => p.employerId.toLowerCase() === params.employerId!.toLowerCase());
    }
    if (params?.status) {
      list = list.filter((p) => p.status === params.status);
    }
    return list;
  },

  async findById(id: string): Promise<WorkforcePlan | null> {
    const found = inMemoryPlans.find((p) => p.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<WorkforcePlan, "id" | "createdAt">): Promise<WorkforcePlan> {
    const newPlan: WorkforcePlan = {
      ...data,
      id: `plan-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    inMemoryPlans.unshift(newPlan);
    return JSON.parse(JSON.stringify(newPlan));
  },

  async update(id: string, updates: Partial<WorkforcePlan>): Promise<WorkforcePlan | null> {
    const idx = inMemoryPlans.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    inMemoryPlans[idx] = {
      ...inMemoryPlans[idx],
      ...updates,
    };
    return JSON.parse(JSON.stringify(inMemoryPlans[idx]));
  },
};
