import { describe, it, expect } from "vitest";
import { credentialService } from "@/server/services/ecosystem/credentialService";

describe("Verifiable Credentials, Public Verification & Time-Bound Share Links", () => {
  it("should issue verifiable credential and verify publicly with zero PII exposure", async () => {
    const cred = await credentialService.issueCredential({
      credentialType: "VOCATIONAL_CERTIFICATE",
      title: "Advanced BMS Calibration Specialist",
      holderId: "cand-rohit-01",
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      proficiencyLevel: "EXPERT",
      issuerId: "org-ssc-asdc",
      issuerName: "Automotive Skills Development Council (ASDC)",
      issuerType: "SECTOR_SKILL_COUNCIL",
    });

    expect(cred.status).toBe("ACTIVE");
    expect(cred.holderMaskedIdentifier).toContain("****");

    const ver = await credentialService.verifyPublicCredential(cred.credentialId);
    expect(ver.isValid).toBe(true);
    expect(ver.competency).toContain("Battery Management Systems");
    expect(ver.issuerName).toContain("Automotive Skills Development Council");
    expect(ver.securityNotice).toContain("Zero PII");
  });

  it("should generate time-bound credential share link", async () => {
    const link = await credentialService.generateShareLink("cred-asdc-bms-2026-001", "cand-rohit-01", 7);
    expect(link.shareUrl).toContain("/verify/cred-asdc-bms-2026-001");
    expect(link.expiresAt).toBeDefined();
  });
});
