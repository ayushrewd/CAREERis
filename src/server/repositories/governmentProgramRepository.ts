// ==============================================================================
// CAREERIS GOVERNMENT PROGRAM REPOSITORY
// Pan-India Scheme Management, Budget Tracking & KPI Registry
// ==============================================================================

import { GovernmentProgram, ProgramStatus, GovernmentScopeType } from "@/types/governmentIntelligence";
import { CANONICAL_GOVERNMENT_PROGRAMS } from "@/data/canonicalGovernmentProgramsData";

let inMemoryPrograms: GovernmentProgram[] = JSON.parse(JSON.stringify(CANONICAL_GOVERNMENT_PROGRAMS));

export const governmentProgramRepository = {
  async findAll(params?: {
    scopeType?: GovernmentScopeType;
    stateCode?: string;
    schemeCode?: string;
    status?: ProgramStatus;
    search?: string;
  }): Promise<GovernmentProgram[]> {
    let list = [...inMemoryPrograms];

    if (params?.scopeType) {
      list = list.filter((p) => p.scopeType === params.scopeType);
    }
    if (params?.stateCode) {
      list = list.filter((p) => !p.targetStateCode || p.targetStateCode === params.stateCode);
    }
    if (params?.schemeCode) {
      list = list.filter((p) => p.schemeCode === params.schemeCode);
    }
    if (params?.status) {
      list = list.filter((p) => p.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.schemeName.toLowerCase().includes(q) ||
          p.leadAgency.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async findById(id: string): Promise<GovernmentProgram | null> {
    const found = inMemoryPrograms.find((p) => p.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<GovernmentProgram, "id">): Promise<GovernmentProgram> {
    const newProg: GovernmentProgram = {
      ...data,
      id: `prog-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryPrograms.unshift(newProg);
    return newProg;
  },

  async update(id: string, updates: Partial<GovernmentProgram>): Promise<GovernmentProgram | null> {
    const index = inMemoryPrograms.findIndex((p) => p.id === id);
    if (index === -1) return null;

    inMemoryPrograms[index] = {
      ...inMemoryPrograms[index],
      ...updates,
    };
    return inMemoryPrograms[index];
  },
};
