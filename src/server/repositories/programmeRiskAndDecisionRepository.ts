// ==============================================================================
// CAREERIS PROGRAMME RISK & DECISION REPOSITORY
// 5x5 Heatmap Risks, Four-Eyes Approval Workflow & Audit Traceability
// ==============================================================================

import { ProgrammeRisk, DecisionRecord } from "@/types/programmeOperations";
import {
  CANONICAL_PROGRAMME_RISKS,
  CANONICAL_DECISION_RECORDS,
} from "@/data/canonicalProgrammeOperationsData";

let inMemoryRisks: ProgrammeRisk[] = JSON.parse(
  JSON.stringify(CANONICAL_PROGRAMME_RISKS)
);
let inMemoryDecisions: DecisionRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_DECISION_RECORDS)
);

export const programmeRiskAndDecisionRepository = {
  async getRisksByProgrammeId(programmeId: string): Promise<ProgrammeRisk[]> {
    const list = inMemoryRisks.filter((r) => r.programmeId === programmeId);
    return JSON.parse(JSON.stringify(list));
  },

  async getAllRisks(): Promise<ProgrammeRisk[]> {
    return JSON.parse(JSON.stringify(inMemoryRisks));
  },

  async addRisk(risk: ProgrammeRisk): Promise<ProgrammeRisk> {
    inMemoryRisks.push(risk);
    return JSON.parse(JSON.stringify(risk));
  },

  async getAllDecisions(): Promise<DecisionRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryDecisions));
  },

  async getDecisionById(decisionId: string): Promise<DecisionRecord | null> {
    const found = inMemoryDecisions.find((d) => d.decisionId === decisionId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createDecision(decision: DecisionRecord): Promise<DecisionRecord> {
    inMemoryDecisions.unshift(decision);
    return JSON.parse(JSON.stringify(decision));
  },

  async updateDecisionStatus(decisionId: string, status: DecisionRecord["status"], approverId?: string, approverName?: string, approverRole?: any): Promise<DecisionRecord | null> {
    const found = inMemoryDecisions.find((d) => d.decisionId === decisionId);
    if (!found) return null;
    found.status = status;
    if (approverId) found.approverId = approverId;
    if (approverName) found.approverName = approverName;
    if (approverRole) found.approverRole = approverRole;
    found.approvedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(found));
  },
};
