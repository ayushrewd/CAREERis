// ==============================================================================
// CAREERIS PROGRAMME EVALUATION SERVICE
// Rigorous Evaluation Reports, Attribution Disclaimers & Confidence Scoring
// ==============================================================================

import { programmeOutcomeRepository } from "@/server/repositories/programmeOutcomeRepository";
import { OutcomeEvaluation } from "@/types/programmeOperations";

export const programmeEvaluationService = {
  async getEvaluation(programmeId: string): Promise<OutcomeEvaluation | null> {
    return programmeOutcomeRepository.getOutcomeEvaluationByProgrammeId(programmeId);
  },

  async recordEvaluation(evalData: OutcomeEvaluation): Promise<OutcomeEvaluation> {
    return programmeOutcomeRepository.createOutcomeEvaluation(evalData);
  },
};
