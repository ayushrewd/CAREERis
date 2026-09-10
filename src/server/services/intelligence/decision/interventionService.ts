import {
  InterventionRecord,
  InterventionStatus,
  InterventionOutcomeEvaluation,
} from "@/types/decisionIntelligence";
import { interventionRepository } from "@/server/repositories/interventionRepository";

export const interventionService = {
  async getAllInterventions(params?: { status?: InterventionStatus; districtId?: string; courseId?: string }): Promise<InterventionRecord[]> {
    return interventionRepository.findAll(params);
  },

  async getInterventionById(id: string): Promise<InterventionRecord | null> {
    return interventionRepository.findById(id);
  },

  async proposeIntervention(data: Omit<InterventionRecord, "id" | "createdAt" | "updatedAt" | "status">): Promise<InterventionRecord> {
    return interventionRepository.create({
      ...data,
      status: "PROPOSED",
      isDemoData: false,
    });
  },

  async reviewIntervention(id: string, decision: "APPROVE" | "REJECT", approvedBy: string, approvalNotes?: string): Promise<InterventionRecord | null> {
    const status: InterventionStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    return interventionRepository.updateStatus(id, status, approvedBy, approvalNotes);
  },

  async updateProgress(id: string, actualValue: number, markCompleted = false): Promise<InterventionRecord | null> {
    const status: InterventionStatus = markCompleted ? "COMPLETED" : "IN_PROGRESS";
    return interventionRepository.updateStatus(id, status, undefined, undefined, actualValue);
  },

  async evaluateOutcome(id: string): Promise<InterventionOutcomeEvaluation | null> {
    const intervention = await interventionRepository.findById(id);
    if (!intervention) return null;

    const actual = intervention.actualValue || intervention.baselineValue;
    const targetDelta = intervention.targetValue - intervention.baselineValue;
    const actualDelta = actual - intervention.baselineValue;
    const achievementPercentage = targetDelta !== 0 ? Math.min(100, Math.round((actualDelta / targetDelta) * 100)) : 100;

    const summary = `Intervention '${intervention.title}' reached ${actual} against target of ${intervention.targetValue} (${achievementPercentage}% achievement). Observed associated improvement in localized skill pipeline and training throughput.`;

    return {
      interventionId: intervention.id,
      title: intervention.title,
      status: intervention.status,
      baselineValue: intervention.baselineValue,
      targetValue: intervention.targetValue,
      actualValue: actual,
      achievementPercentage,
      associatedImprovementSummary: summary,
      isCausalEstablished: false,
      recordedAt: new Date().toISOString(),
    };
  },
};
