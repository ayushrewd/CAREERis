// ==============================================================================
// CAREERIS PROGRAMME OUTCOME REPOSITORY
// Beneficiary Tracking, Multi-Horizon Retention, Evaluations & Placement Quality
// ==============================================================================

import { BeneficiaryFunnel, OutcomeEvaluation } from "@/types/programmeOperations";
import {
  CANONICAL_BENEFICIARY_FUNNELS,
  CANONICAL_OUTCOME_EVALUATIONS,
} from "@/data/canonicalProgrammeOperationsData";

let inMemoryFunnels: BeneficiaryFunnel[] = JSON.parse(
  JSON.stringify(CANONICAL_BENEFICIARY_FUNNELS)
);
let inMemoryEvaluations: OutcomeEvaluation[] = JSON.parse(
  JSON.stringify(CANONICAL_OUTCOME_EVALUATIONS)
);

export const programmeOutcomeRepository = {
  async getBeneficiaryFunnelByProgrammeId(programmeId: string): Promise<BeneficiaryFunnel | null> {
    const found = inMemoryFunnels.find((f) => f.programmeId === programmeId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getAllBeneficiaryFunnels(): Promise<BeneficiaryFunnel[]> {
    return JSON.parse(JSON.stringify(inMemoryFunnels));
  },

  async getOutcomeEvaluationByProgrammeId(programmeId: string): Promise<OutcomeEvaluation | null> {
    const found = inMemoryEvaluations.find((e) => e.programmeId === programmeId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createOutcomeEvaluation(evaluation: OutcomeEvaluation): Promise<OutcomeEvaluation> {
    inMemoryEvaluations.push(evaluation);
    return JSON.parse(JSON.stringify(evaluation));
  },
};
