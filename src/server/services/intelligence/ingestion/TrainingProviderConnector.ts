import { IDataConnector, IngestionBatchResult } from "./IDataConnector";
import { DataQualityReport } from "@/types/intelligence";
import { rawRecordRepository } from "@/server/repositories/rawRecordRepository";

export class TrainingProviderConnector implements IDataConnector {
  sourceId = "src-tp-direct";
  sourceType = "TRAINING_PROVIDER";
  name = "ITI & Polytechnic Direct Training Stream Adapter";

  async fetchData(params?: Record<string, any>): Promise<Array<Record<string, any>>> {
    return [
      {
        submissionId: "tp-sub-001",
        providerCode: "ITI-MH-PUN-001",
        providerName: "Government ITI Aundh, Pune",
        courseCode: "CRS-EV-BMS-2026",
        courseTitle: "Advanced Certificate in EV Battery Management",
        annualCapacity: 35,
        currentEnrollments: 32,
        annualCompletions: 30,
        verifiedPassCount: 28,
        placedCount: 26,
      },
    ];
  }

  async validateRecord(rawRecord: Record<string, any>): Promise<DataQualityReport> {
    const missing: string[] = [];
    if (!rawRecord.submissionId) missing.push("submissionId");
    if (!rawRecord.providerCode) missing.push("providerCode");
    return {
      recordId: rawRecord.submissionId,
      qualityScore: missing.length === 0 ? 98 : 45,
      isValid: missing.length === 0,
      errors: [],
      warnings: [],
      missingFields: missing,
    };
  }

  async normalizeRecord(rawRecord: Record<string, any>): Promise<Record<string, any>> {
    return {
      ...rawRecord,
      stateCode: "MH",
      districtName: "Pune",
      canonicalSkillId: "skill-bms",
    };
  }

  async transformRecord(normalizedRecord: Record<string, any>): Promise<Record<string, any>> {
    return {
      ...normalizedRecord,
      signalType: "TRAINING_CAPACITY",
      confidence: 0.98,
    };
  }

  async persistBatch(transformedRecords: Array<Record<string, any>>): Promise<IngestionBatchResult> {
    for (const rec of transformedRecords) {
      await rawRecordRepository.saveRawRecord({
        sourceId: this.sourceId,
        externalRecordId: rec.submissionId,
        rawPayload: rec,
        checksum: `sha256:${Math.random().toString(36).substring(2)}`,
        processingStatus: "PROCESSED",
      });
    }

    return {
      recordsFetched: transformedRecords.length,
      recordsAccepted: transformedRecords.length,
      recordsRejected: 0,
      recordsUpdated: 0,
      recordsCreated: transformedRecords.length,
      errors: [],
      warnings: [],
      checksum: `sha256:tp-batch-${Date.now()}`,
    };
  }
}
