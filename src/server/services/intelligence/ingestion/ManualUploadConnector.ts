import { IDataConnector, IngestionBatchResult } from "./IDataConnector";
import { DataQualityReport } from "@/types/intelligence";
import { rawRecordRepository } from "@/server/repositories/rawRecordRepository";

export class ManualUploadConnector implements IDataConnector {
  sourceId = "src-manual-upload";
  sourceType = "INTERNAL";
  name = "Administrator Manual Ingestion Adapter";

  private uploadedData: Array<Record<string, any>> = [];

  setData(data: Array<Record<string, any>>) {
    this.uploadedData = data;
  }

  async fetchData(params?: Record<string, any>): Promise<Array<Record<string, any>>> {
    return this.uploadedData;
  }

  async validateRecord(rawRecord: Record<string, any>): Promise<DataQualityReport> {
    const missing: string[] = [];
    if (!rawRecord.title && !rawRecord.skillName) missing.push("title/skillName");
    return {
      recordId: rawRecord.id || `rec-${Date.now()}`,
      qualityScore: missing.length === 0 ? 90 : 30,
      isValid: missing.length === 0,
      errors: [],
      warnings: [],
      missingFields: missing,
    };
  }

  async normalizeRecord(rawRecord: Record<string, any>): Promise<Record<string, any>> {
    return {
      ...rawRecord,
      normalized: true,
    };
  }

  async transformRecord(normalizedRecord: Record<string, any>): Promise<Record<string, any>> {
    return {
      ...normalizedRecord,
      signalType: "MANUAL_ENTRY",
      confidence: 0.85,
    };
  }

  async persistBatch(transformedRecords: Array<Record<string, any>>): Promise<IngestionBatchResult> {
    for (const rec of transformedRecords) {
      await rawRecordRepository.saveRawRecord({
        sourceId: this.sourceId,
        externalRecordId: rec.id || `manual-${Date.now()}`,
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
      checksum: `sha256:manual-batch-${Date.now()}`,
    };
  }
}
