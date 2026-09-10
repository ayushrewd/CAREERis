// ==============================================================================
// CAREERIS SCHEME INTELLIGENCE SERVICE
// Government Skill Schemes, Budgets & Policy Coverage Gap Detection
// ==============================================================================

import { policyIntelligenceRepository } from "@/server/repositories/policyIntelligenceRepository";
import { SchemeIntelligenceRecord } from "@/types/policyIntelligence";

export const schemeIntelligenceService = {
  async getSchemes(): Promise<SchemeIntelligenceRecord[]> {
    return policyIntelligenceRepository.getSchemes();
  },
};
