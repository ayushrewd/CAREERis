// ==============================================================================
// CAREERIS GOVERNMENT PROGRAM SERVICE
// Central & State Scheme Performance, Beneficiary Outcomes & KPI Monitoring
// ==============================================================================

import { governmentProgramRepository } from "@/server/repositories/governmentProgramRepository";
import { GovernmentProgram, ProgramStatus, GovernmentScopeType } from "@/types/governmentIntelligence";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const governmentProgramService = {
  async getPrograms(params?: {
    scopeType?: GovernmentScopeType;
    stateCode?: string;
    schemeCode?: string;
    status?: ProgramStatus;
    search?: string;
  }): Promise<GovernmentProgram[]> {
    return governmentProgramRepository.findAll(params);
  },

  async getProgramById(id: string): Promise<GovernmentProgram | null> {
    return governmentProgramRepository.findById(id);
  },

  async createProgram(
    data: Omit<GovernmentProgram, "id">,
    auth: RequestAuthContext
  ): Promise<GovernmentProgram> {
    const created = await governmentProgramRepository.create(data);

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "GOVERNMENT_PROGRAM_CREATED",
      entity: "GovernmentProgram",
      entityId: created.id,
      details: {
        name: created.name,
        schemeCode: created.schemeCode,
        budgetAllocatedINR: created.budgetAllocatedINR,
      },
    });

    return created;
  },

  async updateProgramKPI(
    programId: string,
    kpiId: string,
    currentValue: number,
    status: "ON_TRACK" | "AT_RISK" | "BEHIND" | "ACHIEVED",
    auth: RequestAuthContext
  ): Promise<GovernmentProgram | null> {
    const prog = await governmentProgramRepository.findById(programId);
    if (!prog) return null;

    const kpiIndex = prog.kpis.findIndex((k) => k.kpiId === kpiId);
    if (kpiIndex !== -1) {
      prog.kpis[kpiIndex].currentValue = currentValue;
      prog.kpis[kpiIndex].status = status;
    }

    const updated = await governmentProgramRepository.update(programId, { kpis: prog.kpis });
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "GOVERNMENT_PROGRAM_KPI_UPDATED",
        entity: "GovernmentProgram",
        entityId: programId,
        details: { kpiId, currentValue, status },
      });
    }
    return updated;
  },
};
