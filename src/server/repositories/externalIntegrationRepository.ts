// ==============================================================================
// CAREERIS EXTERNAL INTEGRATION REPOSITORY
// External Connectors, Entity Mappings, Quality Scores & Quarantine Registry
// ==============================================================================

import {
  ExternalIntegration,
  QuarantineRecord,
  EntityMapping,
} from "@/types/ecosystemInteroperability";
import {
  CANONICAL_EXTERNAL_INTEGRATIONS,
  CANONICAL_QUARANTINE_RECORDS,
  CANONICAL_ENTITY_MAPPINGS,
} from "@/data/canonicalEcosystemData";

let inMemoryIntegrations: ExternalIntegration[] = JSON.parse(
  JSON.stringify(CANONICAL_EXTERNAL_INTEGRATIONS)
);
let inMemoryQuarantine: QuarantineRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_QUARANTINE_RECORDS)
);
let inMemoryMappings: EntityMapping[] = JSON.parse(
  JSON.stringify(CANONICAL_ENTITY_MAPPINGS)
);

export const externalIntegrationRepository = {
  async getAllIntegrations(): Promise<ExternalIntegration[]> {
    return JSON.parse(JSON.stringify(inMemoryIntegrations));
  },

  async getIntegrationById(integrationId: string): Promise<ExternalIntegration | null> {
    const found = inMemoryIntegrations.find((i) => i.integrationId === integrationId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getQuarantineRecords(): Promise<QuarantineRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryQuarantine));
  },

  async addQuarantineRecord(rec: QuarantineRecord): Promise<QuarantineRecord> {
    inMemoryQuarantine.push(rec);
    return JSON.parse(JSON.stringify(rec));
  },

  async resolveQuarantineRecord(recordId: string, status: "CORRECTED_AND_RESOLVED" | "REJECTED"): Promise<QuarantineRecord | null> {
    const found = inMemoryQuarantine.find((q) => q.recordId === recordId);
    if (!found) return null;
    found.status = status;
    return JSON.parse(JSON.stringify(found));
  },

  async getEntityMappings(): Promise<EntityMapping[]> {
    return JSON.parse(JSON.stringify(inMemoryMappings));
  },

  async findMapping(externalProvider: string, externalEntityId: string): Promise<EntityMapping | null> {
    const found = inMemoryMappings.find(
      (m) => m.externalProvider === externalProvider && m.externalEntityId === externalEntityId
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
};
