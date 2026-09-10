// ==============================================================================
// CAREERIS EXECUTIVE COMMAND CENTER SERVICE
// Answers the 9 Core Executive Questions & Multi-Layer Geospatial Rollups
// ==============================================================================

import {
  CANONICAL_EXECUTIVE_DIGEST,
  CANONICAL_PROGRAMMES,
  CANONICAL_PROGRAMME_BUDGETS,
  CANONICAL_INTERVENTION_EXECUTIONS,
} from "@/data/canonicalProgrammeOperationsData";
import { ExecutiveCommandCenterDigest } from "@/types/programmeOperations";

export const executiveCommandCenterService = {
  async getExecutiveDigest(): Promise<ExecutiveCommandCenterDigest> {
    return JSON.parse(JSON.stringify(CANONICAL_EXECUTIVE_DIGEST));
  },

  async getCommandCenterLayers(scope?: { stateCode?: string; districtId?: string }) {
    const digest = await this.getExecutiveDigest();
    return {
      scope: scope || { level: "NATIONAL", country: "INDIA" },
      digest,
      activeProgrammes: CANONICAL_PROGRAMMES,
      budgets: CANONICAL_PROGRAMME_BUDGETS,
      interventions: CANONICAL_INTERVENTION_EXECUTIONS,
    };
  },
};
