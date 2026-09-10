// ==============================================================================
// CAREERIS CONSENT REPOSITORY
// Purpose-Bound, Explicit & Revocable Candidate Consent Grants
// ==============================================================================

import { ConsentGrant, ConsentPurpose } from "@/types/ecosystemInteroperability";
import { CANONICAL_CONSENT_GRANTS } from "@/data/canonicalEcosystemData";

let inMemoryGrants: ConsentGrant[] = JSON.parse(
  JSON.stringify(CANONICAL_CONSENT_GRANTS)
);

export const consentRepository = {
  async getGrantsForCandidate(candidateId: string): Promise<ConsentGrant[]> {
    const list = inMemoryGrants.filter((g) => g.candidateId === candidateId);
    return JSON.parse(JSON.stringify(list));
  },

  async getActiveGrant(candidateId: string, granteeId: string, purpose: ConsentPurpose): Promise<ConsentGrant | null> {
    const found = inMemoryGrants.find(
      (g) =>
        g.candidateId === candidateId &&
        g.granteeId === granteeId &&
        g.purpose === purpose &&
        g.status === "ACTIVE"
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createGrant(grant: ConsentGrant): Promise<ConsentGrant> {
    inMemoryGrants.push(grant);
    return JSON.parse(JSON.stringify(grant));
  },

  async revokeGrant(consentId: string): Promise<ConsentGrant | null> {
    const grant = inMemoryGrants.find((g) => g.consentId === consentId);
    if (!grant) return null;
    grant.status = "REVOKED";
    grant.revokedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(grant));
  },
};
