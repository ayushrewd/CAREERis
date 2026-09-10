import { IDataConnector } from "./IDataConnector";
import { GovernmentDataConnector } from "./GovernmentDataConnector";
import { JobMarketConnector } from "./JobMarketConnector";
import { EmployerSurveyConnector } from "./EmployerSurveyConnector";
import { TrainingProviderConnector } from "./TrainingProviderConnector";
import { IndustryCouncilConnector } from "./IndustryCouncilConnector";
import { ManualUploadConnector } from "./ManualUploadConnector";
import { ingestionJobRepository } from "@/server/repositories/ingestionJobRepository";
import { dataSourceRepository } from "@/server/repositories/dataSourceRepository";
import { DataIngestionJob } from "@/types/intelligence";

export class IngestionEngine {
  private connectors: Map<string, IDataConnector> = new Map();

  constructor() {
    this.registerConnector(new GovernmentDataConnector());
    this.registerConnector(new JobMarketConnector());
    this.registerConnector(new EmployerSurveyConnector());
    this.registerConnector(new TrainingProviderConnector());
    this.registerConnector(new IndustryCouncilConnector());
    this.registerConnector(new ManualUploadConnector());
  }

  registerConnector(connector: IDataConnector) {
    this.connectors.set(connector.sourceId, connector);
  }

  getConnector(sourceId: string): IDataConnector | undefined {
    return this.connectors.get(sourceId);
  }

  async runIngestionJob(sourceId: string, executionMode: "AUTOMATIC" | "MANUAL" | "TEST_MOCK" = "AUTOMATIC"): Promise<DataIngestionJob> {
    const connector = this.getConnector(sourceId);
    if (!connector) {
      throw new Error(`No connector registered for source: ${sourceId}`);
    }

    const source = await dataSourceRepository.findById(sourceId);

    // 1. Create Ingestion Job Record in RUNNING status
    const job = await ingestionJobRepository.create({
      sourceId,
      sourceName: source?.name || connector.name,
      startedAt: new Date().toISOString(),
      status: "RUNNING",
      recordsReceived: 0,
      recordsAccepted: 0,
      recordsRejected: 0,
      recordsUpdated: 0,
      recordsCreated: 0,
      errors: [],
      warnings: [],
      checksum: "",
      executionMode,
    });

    try {
      // 2. Fetch
      const rawRecords = await connector.fetchData();
      let accepted = 0;
      let rejected = 0;
      const validRecords: Array<Record<string, any>> = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      // 3. Validate & Normalize
      for (const rec of rawRecords) {
        const quality = await connector.validateRecord(rec);
        if (quality.isValid) {
          const normalized = await connector.normalizeRecord(rec);
          const transformed = await connector.transformRecord(normalized);
          validRecords.push(transformed);
          accepted++;
        } else {
          rejected++;
          errors.push(`Record ${quality.recordId || "unknown"} validation failed: ${quality.errors.join(", ")}`);
        }
      }

      // 4. Persist Batch
      const persistRes = await connector.persistBatch(validRecords);

      // 5. Update Job
      const finalStatus = rejected === 0 ? "COMPLETED" : accepted > 0 ? "PARTIAL" : "FAILED";
      const updatedJob = await ingestionJobRepository.update(job.id, {
        status: finalStatus,
        completedAt: new Date().toISOString(),
        recordsReceived: rawRecords.length,
        recordsAccepted: accepted,
        recordsRejected: rejected,
        recordsCreated: persistRes.recordsCreated,
        recordsUpdated: persistRes.recordsUpdated,
        errors: [...errors, ...persistRes.errors],
        warnings: [...warnings, ...persistRes.warnings],
        checksum: persistRes.checksum,
      });

      // 6. Update Source Health & Error rate
      const errorRate = rawRecords.length > 0 ? rejected / rawRecords.length : 0;
      await dataSourceRepository.updateStatus(
        sourceId,
        errorRate > 0.3 ? "DEGRADED" : "HEALTHY",
        errorRate
      );

      return updatedJob || job;
    } catch (err: any) {
      await ingestionJobRepository.update(job.id, {
        status: "FAILED",
        completedAt: new Date().toISOString(),
        errors: [err.message || "Ingestion pipeline failure"],
      });
      await dataSourceRepository.updateStatus(sourceId, "FAILED", 1.0);
      throw err;
    }
  }
}

export const ingestionEngine = new IngestionEngine();
