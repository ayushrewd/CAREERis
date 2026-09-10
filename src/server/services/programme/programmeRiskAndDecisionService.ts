// ==============================================================================
// CAREERIS PROGRAMME RISK & DECISION SERVICE
// 5x5 Heatmap Matrix, Four-Eyes Principle Separation of Duties & Audit Trails
// ==============================================================================

import { programmeRiskAndDecisionRepository } from "@/server/repositories/programmeRiskAndDecisionRepository";
import { ProgrammeRisk, DecisionRecord } from "@/types/programmeOperations";
import { UserRole } from "@/types";

export const programmeRiskAndDecisionService = {
  async getProgrammeRisks(programmeId?: string): Promise<ProgrammeRisk[]> {
    if (programmeId) {
      return programmeRiskAndDecisionRepository.getRisksByProgrammeId(programmeId);
    }
    return programmeRiskAndDecisionRepository.getAllRisks();
  },

  async addProgrammeRisk(risk: ProgrammeRisk): Promise<ProgrammeRisk> {
    return programmeRiskAndDecisionRepository.addRisk(risk);
  },

  async getAllDecisions(): Promise<DecisionRecord[]> {
    return programmeRiskAndDecisionRepository.getAllDecisions();
  },

  async proposeDecision(params: {
    decisionType: DecisionRecord["decisionType"];
    targetEntityId: string;
    targetEntityName: string;
    requesterId: string;
    requesterName: string;
    requesterRole: UserRole;
    reason: string;
    evidenceSummary: string;
  }): Promise<DecisionRecord> {
    const decision: DecisionRecord = {
      decisionId: `dec-${Date.now().toString(36)}`,
      decisionType: params.decisionType,
      targetEntityId: params.targetEntityId,
      targetEntityName: params.targetEntityName,
      requesterId: params.requesterId,
      requesterName: params.requesterName,
      requesterRole: params.requesterRole,
      status: "PROPOSED",
      reason: params.reason,
      evidenceSummary: params.evidenceSummary,
      fourEyesEnforced: true,
      requestedAt: new Date().toISOString(),
    };

    return programmeRiskAndDecisionRepository.createDecision(decision);
  },

  async approveDecision(params: {
    decisionId: string;
    approverId: string;
    approverName: string;
    approverRole: UserRole;
  }): Promise<DecisionRecord> {
    const decision = await programmeRiskAndDecisionRepository.getDecisionById(params.decisionId);
    if (!decision) {
      throw new Error(`Decision with ID '${params.decisionId}' not found.`);
    }

    // Four-Eyes Separation of Duties Check
    if (decision.requesterId === params.approverId) {
      throw new Error(
        `Four-Eyes Violation: Requester (${decision.requesterName}) cannot self-approve restricted action '${decision.decisionType}'. Separation of duties is strictly enforced.`
      );
    }

    const updated = await programmeRiskAndDecisionRepository.updateDecisionStatus(
      params.decisionId,
      "APPROVED",
      params.approverId,
      params.approverName,
      params.approverRole
    );

    return updated!;
  },
};
