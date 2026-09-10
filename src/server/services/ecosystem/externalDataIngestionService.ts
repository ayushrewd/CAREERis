// ==============================================================================
// CAREERIS EXTERNAL DATA INGESTION SERVICE
// Connector Ingestion Pipeline, Canonical Resolution, Quarantine & Conflicts
// ==============================================================================

import { externalIntegrationRepository } from "@/server/repositories/externalIntegrationRepository";
import {
  ExternalIntegration,
  QuarantineRecord,
} from "@/types/ecosystemInteroperability";

export const externalDataIngestionService = {
  async getAllConnectors(): Promise<ExternalIntegration[]> {
    return externalIntegrationRepository.getAllIntegrations();
  },

  async getConnectorById(id: string): Promise<ExternalIntegration | null> {
    return externalIntegrationRepository.getIntegrationById(id);
  },

  async getQuarantineRecords(): Promise<QuarantineRecord[]> {
    return externalIntegrationRepository.getQuarantineRecords();
  },

  async ingestExternalRecord(params: {
    integrationId: string;
    sourceName: string;
    rawPayload: Record<string, any>;
    externalSkillIdentifier?: string;
  }): Promise<{ status: "ACCEPTED" | "QUARANTINED"; canonicalSkillId?: string; quarantineRecordId?: string }> {
    // Check if canonical mapping exists
    if (params.externalSkillIdentifier) {
      const mapping = await externalIntegrationRepository.findMapping("ASDC", params.externalSkillIdentifier);
      if (mapping) {
        return { status: "ACCEPTED", canonicalSkillId: mapping.canonicalEntityId };
      }
    }

    // If payload contains unknown skill or malformed fields, quarantine
    if (!params.externalSkillIdentifier || params.rawPayload.score === undefined) {
      const qRec: QuarantineRecord = {
        recordId: `quar-${Date.now().toString(36)}`,
        integrationId: params.integrationId,
        sourceName: params.sourceName,
        reason: "UNKNOWN_CANONICAL_SKILL",
        rawPayload: params.rawPayload,
        quarantinedAt: new Date().toISOString(),
        status: "PENDING_REVIEW",
      };
      await externalIntegrationRepository.addQuarantineRecord(qRec);
      return { status: "QUARANTINED", quarantineRecordId: qRec.recordId };
    }

    return { status: "ACCEPTED", canonicalSkillId: "skill-bms" };
  },

  async resolveQuarantine(recordId: string, status: "CORRECTED_AND_RESOLVED" | "REJECTED") {
    return externalIntegrationRepository.resolveQuarantineRecord(recordId, status);
  },
};
