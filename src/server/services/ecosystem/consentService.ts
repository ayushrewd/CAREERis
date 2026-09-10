// ==============================================================================
// CAREERIS CONSENT SERVICE
// Purpose-Bound Consent Evaluation, Data-Access Authorization & Revocation
// ==============================================================================

import { consentRepository } from "@/server/repositories/consentRepository";
import { ConsentGrant, ConsentPurpose } from "@/types/ecosystemInteroperability";

export const consentService = {
  async getCandidateConsents(candidateId: string): Promise<ConsentGrant[]> {
    return consentRepository.getGrantsForCandidate(candidateId);
  },

  async isDataAccessPermitted(candidateId: string, granteeId: string, purpose: ConsentPurpose): Promise<boolean> {
    const grant = await consentRepository.getActiveGrant(candidateId, granteeId, purpose);
    if (!grant) return false;

    // Check expiration
    if (grant.expiresAt && new Date(grant.expiresAt) < new Date()) {
      return false;
    }
    return true;
  },

  async grantConsent(params: {
    candidateId: string;
    granteeId: string;
    granteeName: string;
    granteeType: "EMPLOYER" | "TRAINING_PROVIDER" | "GOVERNMENT" | "INDUSTRY_COUNCIL";
    purpose: ConsentPurpose;
    dataScope: string[];
    durationDays?: number;
  }): Promise<ConsentGrant> {
    const expiresAt = params.durationDays
      ? new Date(Date.now() + params.durationDays * 86400000).toISOString()
      : undefined;

    const grant: ConsentGrant = {
      consentId: `consent-${Date.now().toString(36)}`,
      candidateId: params.candidateId,
      granteeId: params.granteeId,
      granteeName: params.granteeName,
      granteeType: params.granteeType,
      purpose: params.purpose,
      grantedAt: new Date().toISOString(),
      expiresAt,
      status: "ACTIVE",
      dataScope: params.dataScope,
    };

    return consentRepository.createGrant(grant);
  },

  async revokeConsent(consentId: string): Promise<ConsentGrant | null> {
    return consentRepository.revokeGrant(consentId);
  },
};
