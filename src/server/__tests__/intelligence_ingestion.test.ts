import { describe, it, expect } from "vitest";
import { ingestionEngine } from "@/server/services/intelligence/ingestion/ingestionEngine";
import { GovernmentDataConnector } from "@/server/services/intelligence/ingestion/GovernmentDataConnector";
import { JobMarketConnector } from "@/server/services/intelligence/ingestion/JobMarketConnector";
import { dataSourceRepository } from "@/server/repositories/dataSourceRepository";

describe("Labour-Market Intelligence: Ingestion Framework", () => {
  it("should have registered connectors in ingestion engine", () => {
    const govConnector = ingestionEngine.getConnector("src-msde-ncvt");
    expect(govConnector).toBeDefined();
    expect(govConnector?.sourceType).toBe("GOVERNMENT");

    const jmrConnector = ingestionEngine.getConnector("src-jobmarket-aggregator");
    expect(jmrConnector).toBeDefined();
    expect(jmrConnector?.sourceType).toBe("JOB_MARKET");
  });

  it("should validate and normalize government vocational payloads", async () => {
    const connector = new GovernmentDataConnector();
    const records = await connector.fetchData();
    expect(records.length).toBeGreaterThan(0);

    const validation = await connector.validateRecord(records[0]);
    expect(validation.isValid).toBe(true);
    expect(validation.qualityScore).toBeGreaterThanOrEqual(90);

    const normalized = await connector.normalizeRecord(records[0]);
    expect(normalized.stateCode).toBe("MH");
  });

  it("should execute end-to-end ingestion pipeline and track job status", async () => {
    const job = await ingestionEngine.runIngestionJob("src-msde-ncvt", "TEST_MOCK");
    expect(job).toBeDefined();
    expect(job.status).toBe("COMPLETED");
    expect(job.recordsReceived).toBeGreaterThan(0);
    expect(job.recordsAccepted).toBe(job.recordsReceived);
    expect(job.checksum).toContain("sha256:");
  });

  it("should query registered data sources by type and status", async () => {
    const govSources = await dataSourceRepository.findAll({ sourceType: "GOVERNMENT" });
    expect(govSources.length).toBeGreaterThanOrEqual(2);
    expect(govSources.some((s) => s.code === "MSDE_NCVT_REGISTRY")).toBe(true);
  });
});
