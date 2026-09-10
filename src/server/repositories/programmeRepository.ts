// ==============================================================================
// CAREERIS PROGRAMME REPOSITORY
// Lifecycle Management, Scheme Registries, Targets & Theory of Change
// ==============================================================================

import { Programme, ProgrammeLifecycleStatus } from "@/types/programmeOperations";
import { CANONICAL_PROGRAMMES } from "@/data/canonicalProgrammeOperationsData";

let inMemoryProgrammes: Programme[] = JSON.parse(
  JSON.stringify(CANONICAL_PROGRAMMES)
);

export const programmeRepository = {
  async getAllProgrammes(filters?: { stateCode?: string; status?: ProgrammeLifecycleStatus }): Promise<Programme[]> {
    let list = inMemoryProgrammes;
    if (filters?.stateCode) {
      list = list.filter((p) => !p.stateCode || p.stateCode === filters.stateCode || p.scopeLevel === "NATIONAL");
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    return JSON.parse(JSON.stringify(list));
  },

  async getProgrammeById(programmeId: string): Promise<Programme | null> {
    const found = inMemoryProgrammes.find((p) => p.programmeId === programmeId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createProgramme(prog: Programme): Promise<Programme> {
    inMemoryProgrammes.push(prog);
    return JSON.parse(JSON.stringify(prog));
  },

  async updateProgrammeStatus(programmeId: string, status: ProgrammeLifecycleStatus): Promise<Programme | null> {
    const found = inMemoryProgrammes.find((p) => p.programmeId === programmeId);
    if (!found) return null;
    found.status = status;
    found.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(found));
  },
};
