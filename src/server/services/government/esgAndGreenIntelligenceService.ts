// ==============================================================================
// CAREERIS ESG & GREEN SKILLS INTELLIGENCE SERVICE
// Green Transformation, Gender Equity Inclusion & Governance Scores
// ==============================================================================

import { CANONICAL_ESG_SUMMARY } from "@/data/canonicalProgrammeOperationsData";
import { ESGAndGreenSkillsSummary } from "@/types/programmeOperations";

export const esgAndGreenIntelligenceService = {
  async getESGSummary(): Promise<ESGAndGreenSkillsSummary> {
    return JSON.parse(JSON.stringify(CANONICAL_ESG_SUMMARY));
  },
};
