// ==============================================================================
// CAREERIS PROGRAMME SERVICE
// Programme Lifecycle State Machine, Theory of Change & KPI Engine
// ==============================================================================

import { programmeRepository } from "@/server/repositories/programmeRepository";
import { Programme, ProgrammeLifecycleStatus } from "@/types/programmeOperations";

export const programmeService = {
  async getProgrammes(filters?: { stateCode?: string; status?: ProgrammeLifecycleStatus }): Promise<Programme[]> {
    return programmeRepository.getAllProgrammes(filters);
  },

  async getProgrammeById(programmeId: string): Promise<Programme | null> {
    return programmeRepository.getProgrammeById(programmeId);
  },

  async transitionStatus(programmeId: string, newStatus: ProgrammeLifecycleStatus, userRole: string): Promise<Programme | null> {
    // RBAC validation: Only Government Admins and Directors can transition official programme statuses
    const allowedRoles = ["NATIONAL_GOVERNMENT", "STATE_GOVERNMENT", "PLATFORM_ADMIN", "GOVERNMENT_ADMIN"];
    if (!allowedRoles.includes(userRole)) {
      throw new Error(`Unauthorized: Role '${userRole}' is not permitted to transition programme status.`);
    }

    return programmeRepository.updateProgrammeStatus(programmeId, newStatus);
  },

  async getTheoryOfChange(programmeId: string) {
    const prog = await this.getProgrammeById(programmeId);
    if (!prog) return null;
    return {
      programmeId: prog.programmeId,
      programmeName: prog.name,
      problemStatement: prog.problemStatement,
      targetPopulationDescription: prog.targetPopulationDescription,
      theoryOfChange: prog.theoryOfChange,
      kpis: prog.kpis,
    };
  },
};
