// ==============================================================================
// CAREERIS INTERVENTION MANAGEMENT SERVICE
// 11-Stage State Machine, Outcome Tracking (Baseline/Target/Actual) & Audit
// ==============================================================================

import { governmentInterventionRepository } from "@/server/repositories/governmentInterventionRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import {
  GovernmentIntervention,
  GovernmentInterventionStatus,
  GovernmentScopeType,
} from "@/types/governmentIntelligence";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const interventionManagementService = {
  async getInterventions(params?: {
    status?: GovernmentInterventionStatus;
    scope?: GovernmentScopeType;
    stateCode?: string;
    districtId?: string;
    programId?: string;
    targetSkillId?: string;
  }): Promise<GovernmentIntervention[]> {
    return governmentInterventionRepository.findAll(params);
  },

  async getInterventionById(id: string): Promise<GovernmentIntervention | null> {
    return governmentInterventionRepository.findById(id);
  },

  async proposeIntervention(
    data: Omit<GovernmentIntervention, "id" | "approvalChain" | "achievementPercentage" | "variancePercentage">,
    auth: RequestAuthContext
  ): Promise<GovernmentIntervention> {
    const created = await governmentInterventionRepository.create({
      ...data,
      status: "PROPOSED",
      achievementPercentage: 0,
      variancePercentage: 100,
      approvalChain: [
        {
          stage: "PROPOSED",
          actedBy: auth.fullName,
          actedAt: new Date().toISOString(),
          notes: "Initial policy intervention proposal submitted for departmental review.",
        },
      ],
    });

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "GOVERNMENT_INTERVENTION_PROPOSED",
      entity: "GovernmentIntervention",
      entityId: created.id,
      details: {
        title: created.title,
        stateCode: created.stateCode,
        districtName: created.districtName,
        budgetINR: created.budgetINR,
      },
    });

    return created;
  },

  async updateInterventionStatus(
    id: string,
    newStatus: GovernmentInterventionStatus,
    notes: string | undefined,
    actualValue: number | undefined,
    auth: RequestAuthContext
  ): Promise<GovernmentIntervention | null> {
    const updated = await governmentInterventionRepository.updateStatus(
      id,
      newStatus,
      auth.fullName,
      notes,
      actualValue
    );

    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "GOVERNMENT_INTERVENTION_STATUS_CHANGED",
        entity: "GovernmentIntervention",
        entityId: id,
        details: {
          newStatus,
          notes,
          actualValue: updated.actualValue,
          achievementPercentage: updated.achievementPercentage,
        },
      });

      // Dispatch alert/notification if funded or completed
      if (newStatus === "FUNDED" || newStatus === "COMPLETED") {
        await notificationRepository.create({
          userId: "admin-state-gov",
          type: "APPLICATION_UPDATE",
          title: `Intervention ${newStatus.replace(/_/g, " ")}: ${updated.title}`,
          message: `Intervention in ${updated.districtName} has progressed to ${newStatus}.`,
          actionUrl: `/government/interventions/${updated.id}`,
        });
      }
    }

    return updated;
  },
};
