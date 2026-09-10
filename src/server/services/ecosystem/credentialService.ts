// ==============================================================================
// CAREERIS CREDENTIAL SERVICE
// Verifiable Credential Issuance, Public Verification (Zero PII) & Share Links
// ==============================================================================

import { credentialRepository } from "@/server/repositories/credentialRepository";
import {
  VerifiableCredential,
  PublicCredentialVerificationResult,
  CredentialShareLink,
} from "@/types/ecosystemInteroperability";

export const credentialService = {
  async getCandidateCredentials(holderId: string): Promise<VerifiableCredential[]> {
    return credentialRepository.getCredentialsByHolderId(holderId);
  },

  async getCredentialById(credentialId: string): Promise<VerifiableCredential | null> {
    return credentialRepository.getCredentialById(credentialId);
  },

  async verifyPublicCredential(credentialId: string): Promise<PublicCredentialVerificationResult> {
    const cred = await credentialRepository.getCredentialById(credentialId);
    if (!cred || cred.status !== "ACTIVE") {
      return {
        isValid: false,
        credentialId,
        title: cred?.title || "Unknown Credential",
        competency: cred?.skillName || "Unverified",
        issuerName: cred?.issuerName || "Unknown Issuer",
        issuedAt: cred?.issuedAt || new Date().toISOString(),
        status: cred?.status || "REVOKED",
        verificationTimestamp: new Date().toISOString(),
        verificationAuditId: `audit-ver-${Date.now().toString(36)}`,
        securityNotice: "Zero PII: Public verification displays minimal authenticity metadata only. Candidate private PII is protected.",
      };
    }

    return {
      isValid: true,
      credentialId: cred.credentialId,
      title: cred.title,
      competency: `${cred.skillName} (${cred.proficiencyLevel})`,
      issuerName: cred.issuerName,
      issuedAt: cred.issuedAt,
      status: cred.status,
      verificationTimestamp: new Date().toISOString(),
      verificationAuditId: `audit-ver-${Date.now().toString(36)}`,
      securityNotice: "Zero PII: Public verification displays minimal authenticity metadata only. Candidate private PII is protected.",
    };
  },

  async issueCredential(params: {
    credentialType: "SKILL_BADGE" | "VOCATIONAL_CERTIFICATE" | "APPRENTICESHIP_COMPLETION" | "ASSESSMENT_MASTERY";
    title: string;
    holderId: string;
    skillId: string;
    skillName: string;
    proficiencyLevel: "AWARENESS" | "FOUNDATIONAL" | "PRACTITIONER" | "EXPERT" | "MASTER";
    issuerId: string;
    issuerName: string;
    issuerType: "SECTOR_SKILL_COUNCIL" | "NCVT_DGT" | "ENTERPRISE_OEM" | "POLYTECHNIC";
    evidenceUri?: string;
  }): Promise<VerifiableCredential> {
    const cred: VerifiableCredential = {
      credentialId: `cred-${Date.now().toString(36)}`,
      credentialType: params.credentialType,
      title: params.title,
      holderId: params.holderId,
      holderMaskedIdentifier: `CAND-****-${params.holderId.slice(-3)}`,
      skillId: params.skillId,
      skillName: params.skillName,
      proficiencyLevel: params.proficiencyLevel,
      issuerId: params.issuerId,
      issuerName: params.issuerName,
      issuerType: params.issuerType,
      issuedAt: new Date().toISOString(),
      status: "ACTIVE",
      evidenceReferenceUri: params.evidenceUri || `https://evidence.careeris.gov.in/credentials/cred-${Date.now().toString(36)}.json`,
      digitalSignatureHash: "sha256-verified-integrity-hash",
      version: "1.0",
    };

    return credentialRepository.issueCredential(cred);
  },

  async revokeCredential(credentialId: string): Promise<VerifiableCredential | null> {
    return credentialRepository.revokeCredential(credentialId);
  },

  async generateShareLink(credentialId: string, candidateId: string, durationDays: number = 7): Promise<CredentialShareLink> {
    const shareId = `share-${Date.now().toString(36)}`;
    const share: CredentialShareLink = {
      shareId,
      credentialId,
      candidateId,
      shareUrl: `https://careeris.gov.in/verify/${credentialId}?shareId=${shareId}`,
      expiresAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
      allowedViewCount: 20,
      currentViews: 0,
    };

    return credentialRepository.createShareLink(share);
  },
};
