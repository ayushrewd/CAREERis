import { describe, it, expect } from "vitest";
import { externalDataIngestionService } from "@/server/services/ecosystem/externalDataIngestionService";

describe("External Data Ingestion, Canonical Mapping & Quarantine", () => {
  it("should accept records with valid canonical entity mappings", async () => {
    const res = await externalDataIngestionService.ingestExternalRecord({
      integrationId: "conn-asdc-api-live",
      sourceName: "ASDC Assessment Feed",
      rawPayload: { candidateScore: 92 },
      externalSkillIdentifier: "ASDC_QP_AUTO_7701",
    });

    expect(res.status).toBe("ACCEPTED");
    expect(res.canonicalSkillId).toBe("skill-bms");
  });

  it("should quarantine unmapped or malformed external records", async () => {
    const res = await externalDataIngestionService.ingestExternalRecord({
      integrationId: "conn-asdc-api-live",
      sourceName: "ASDC Assessment Feed",
      rawPayload: { candidateName: "Unknown Candidate" }, // Missing score
    });

    expect(res.status).toBe("QUARANTINED");
    expect(res.quarantineRecordId).toBeDefined();
  });
});
