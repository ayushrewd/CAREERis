// ==============================================================================
// CAREERIS WORKFORCE PLANNING SERVICE
// Skill-Based Workforce Headcount & Deficit Planning
// ==============================================================================

import { workforcePlanRepository } from "@/server/repositories/workforcePlanRepository";
import { WorkforcePlan } from "@/types/employerIntelligence";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const workforcePlanningService = {
  async getPlans(employerId = "comp-tata-motors"): Promise<WorkforcePlan[]> {
    return workforcePlanRepository.findAll({ employerId });
  },

  async getPlanById(id: string): Promise<WorkforcePlan | null> {
    return workforcePlanRepository.findById(id);
  },

  async createPlan(
    data: Omit<WorkforcePlan, "id" | "createdAt">,
    auth: RequestAuthContext
  ): Promise<WorkforcePlan> {
    const plan = await workforcePlanRepository.create(data);

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "WORKFORCE_PLAN_CREATED",
      entity: "WorkforcePlan",
      entityId: plan.id,
      details: {
        planTitle: plan.planTitle,
        planningPeriod: plan.planningPeriod,
        totalRolesTargeted: plan.rolesTargeted.length,
      },
    });

    return plan;
  },

  async updatePlan(
    id: string,
    updates: Partial<WorkforcePlan>,
    auth: RequestAuthContext
  ): Promise<WorkforcePlan | null> {
    const updated = await workforcePlanRepository.update(id, updates);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "WORKFORCE_PLAN_UPDATED",
        entity: "WorkforcePlan",
        entityId: id,
        details: { fieldsUpdated: Object.keys(updates) },
      });
    }
    return updated;
  },
};
