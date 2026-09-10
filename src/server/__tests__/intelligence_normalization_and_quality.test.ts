import { describe, it, expect } from "vitest";
import { dataQualityService } from "@/server/services/intelligence/dataQualityService";
import { deduplicationService } from "@/server/services/intelligence/deduplicationService";
import { roleNormalizationService } from "@/server/services/intelligence/roleNormalizationService";
import { geographyNormalizationService } from "@/server/services/intelligence/geographyNormalizationService";

describe("Labour-Market Intelligence: Quality & Normalization Services", () => {
  it("should score valid job market posting with high quality", async () => {
    const report = await dataQualityService.validateJobMarketPayload({
      externalId: "ext-valid-01",
      jobTitle: "Senior Battery Management System Calibration Engineer",
      employerName: "Tata Motors EV",
      location: "Pune, Maharashtra",
      salaryMin: 800000,
      salaryMax: 1400000,
      skillsRaw: ["BMS", "Python"],
      postedAt: "2026-02-27T00:00:00Z",
    });

    expect(report.isValid).toBe(true);
    expect(report.qualityScore).toBeGreaterThanOrEqual(90);
    expect(report.errors.length).toBe(0);
  });

  it("should detect invalid payloads with missing mandatory fields and conflicting salary", async () => {
    const report = await dataQualityService.validateJobMarketPayload({
      externalId: "ext-invalid-01",
      salaryMin: 2000000,
      salaryMax: 1000000, // Invalid: min > max
    });

    expect(report.isValid).toBe(false);
    expect(report.qualityScore).toBeLessThan(50);
    expect(report.missingFields).toContain("jobTitle");
    expect(report.missingFields).toContain("location");
    expect(report.errors.some((e) => e.includes("Conflicting salary bounds"))).toBe(true);
  });

  it("should compute deterministic checksums for deduplication", async () => {
    const recordA = {
      sourceId: "src-jobmarket-aggregator",
      externalId: "job-100",
      jobTitle: "PLC Automation Engineer",
      employerName: "Bajaj Auto",
      location: "Pune",
      postedAt: "2026-02-27T10:00:00Z",
    };

    const checksumA = deduplicationService.computeChecksum(recordA);
    const checksumB = deduplicationService.computeChecksum({ ...recordA });
    expect(checksumA).toBe(checksumB);
  });

  it("should normalize raw role titles to canonical roles", async () => {
    const res = await roleNormalizationService.normalizeRole("BMS Firmware Developer");
    expect(res.status).toBe("RESOLVED");
    expect(res.canonicalRole).toBeDefined();
    expect(res.canonicalRole?.id).toBe("role-bms-lead");
    expect(res.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("should resolve locations to pan-India states, districts, and clusters", async () => {
    const resCluster = await geographyNormalizationService.resolveLocation("Chakan Automotive, EV & Robotics Corridor, Pune");
    expect(resCluster.status).toBe("RESOLVED");
    expect(resCluster.state?.code).toBe("MH");
    expect(resCluster.district?.name).toBe("Pune");
    expect(resCluster.cluster?.code).toBe("MH-PUN-CHAKAN");

    const resState = await geographyNormalizationService.resolveLocation("Bengaluru, Karnataka");
    expect(resState.status).toBe("RESOLVED");
    expect(resState.state?.code).toBe("KA");

    const resUnresolved = await geographyNormalizationService.resolveLocation("Unknown Faraway Planet 9");
    expect(resUnresolved.status).toBe("GEOGRAPHY_UNRESOLVED");
  });
});
