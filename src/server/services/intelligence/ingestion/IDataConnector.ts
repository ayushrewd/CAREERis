import { DataSourceRecord, DataQualityReport } from "@/types/intelligence";

export interface IngestionBatchResult {
  recordsFetched: number;
  recordsAccepted: number;
  recordsRejected: number;
  recordsUpdated: number;
  recordsCreated: number;
  errors: string[];
  warnings: string[];
  checksum: string;
}

export interface IDataConnector {
  sourceId: string;
  sourceType: string;
  name: string;

  fetchData(params?: Record<string, any>): Promise<Array<Record<string, any>>>;
  validateRecord(rawRecord: Record<string, any>): Promise<DataQualityReport>;
  normalizeRecord(rawRecord: Record<string, any>): Promise<Record<string, any>>;
  transformRecord(normalizedRecord: Record<string, any>): Promise<Record<string, any>>;
  persistBatch(transformedRecords: Array<Record<string, any>>): Promise<IngestionBatchResult>;
}
