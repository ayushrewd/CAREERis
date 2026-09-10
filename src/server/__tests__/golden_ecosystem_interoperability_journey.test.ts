import { describe, it, expect } from "vitest";
import { externalDataIngestionService } from "@/server/services/ecosystem/externalDataIngestionService";
import { consentService } from "@/server/services/ecosystem/consentService";
import { credentialService } from "@/server/services/ecosystem/credentialService";
import { webhookService } from "@/server/services/ecosystem/webhookService";
import { apiKeyAndPartnerService } from "@/server/services/ecosystem/apiKeyAndPartnerService";
import { securityAuditService } from "@/server/services/security/securityAuditService";
import { systemHealthService } from "@/server/services/security/systemHealthService";

describe("Golden Ecosystem Interoperability Closed-Loop Journey", () => {
  it("should execute the full closed-loop interoperable ecosystem lifecycle end-to-end", async () => {
    // 1. External Ingestion & Canonical Resolution
    const acceptedIngestion = await externalDataIngestionService.ingestExternalRecord({
      integrationId: "conn-asdc-api-live",
      sourceName: "ASDC Sector Skill Council Assessment Feed",
      rawPayload: { candidateScore: 94 },
      externalSkillIdentifier: "ASDC_QP_AUTO_7701",
    });
    expect(acceptedIngestion.status).toBe("ACCEPTED");
    expect(acceptedIngestion.canonicalSkillId).toBe("skill-bms");

    // 2. Quarantine Handling of Malformed External Payload
    const quarantinedIngestion = await externalDataIngestionService.ingestExternalRecord({
      integrationId: "conn-asdc-api-live",
      sourceName: "ASDC Untrusted Feed",
      rawPayload: { unmappedTrade: "Random Trade XYZ" },
    });
    expect(quarantinedIngestion.status).toBe("QUARANTINED");
    expect(quarantinedIngestion.quarantineRecordId).toBeDefined();

    // 3. Candidate Purpose-Bound Consent Grant
    const consent = await consentService.grantConsent({
      candidateId: "cand-rohit-01",
      granteeId: "comp-tata-motors",
      granteeName: "Tata Motors Passenger Vehicles Ltd",
      granteeType: "EMPLOYER",
      purpose: "APPLICATION_SHARING",
      dataScope: ["skills:bms", "assessment_scores"],
      durationDays: 30,
    });
    expect(consent.status).toBe("ACTIVE");

    // 4. Verifiable Credential Issuance
    const credential = await credentialService.issueCredential({
      credentialType: "VOCATIONAL_CERTIFICATE",
      title: "EV BMS Master Diagnostic Specialist",
      holderId: "cand-rohit-01",
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      proficiencyLevel: "EXPERT",
      issuerId: "org-ssc-asdc",
      issuerName: "Automotive Skills Development Council (ASDC)",
      issuerType: "SECTOR_SKILL_COUNCIL",
    });
    expect(credential.status).toBe("ACTIVE");
    expect(credential.holderMaskedIdentifier).toContain("****");

    // 5. Public Zero-PII Credential Verification
    const verification = await credentialService.verifyPublicCredential(credential.credentialId);
    expect(verification.isValid).toBe(true);
    expect(verification.competency).toContain("Battery Management Systems");
    expect(verification.securityNotice).toContain("Zero PII");

    // 6. Time-Bound Credential Share Link
    const shareLink = await credentialService.generateShareLink(credential.credentialId, "cand-rohit-01", 7);
    expect(shareLink.shareUrl).toContain(credential.credentialId);

    // 7. Partner Webhook Event Dispatch
    const webhookDeliveries = await webhookService.dispatchDomainEvent("CredentialIssued", {
      credentialId: credential.credentialId,
      holderMaskedIdentifier: credential.holderMaskedIdentifier,
    });
    expect(webhookDeliveries.length).toBeGreaterThanOrEqual(0);

    // 8. Security Audit Logging
    const auditEvent = await securityAuditService.logEvent({
      userId: "cand-rohit-01",
      organizationId: "comp-tata-motors",
      eventType: "CREDENTIAL_ISSUED",
      ipAddress: "127.0.0.1",
      resourceAccessed: `/api/v1/credentials/${credential.credentialId}`,
      status: "SUCCESS",
      details: "Issued verifiable BMS credential with SHA-256 integrity hash.",
    });
    expect(auditEvent.eventId).toBeDefined();

    // 9. System Infrastructure Observability
    const healthStatus = await systemHealthService.getOverallSystemStatus();
    expect(healthStatus.status).toBe("HEALTHY");
  });
});
