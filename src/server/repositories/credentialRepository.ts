// ==============================================================================
// CAREERIS CREDENTIAL REPOSITORY
// Verifiable Credentials, Public Verification & Time-Bound Share Links
// ==============================================================================

import {
  VerifiableCredential,
  CredentialShareLink,
} from "@/types/ecosystemInteroperability";
import { CANONICAL_VERIFIABLE_CREDENTIALS } from "@/data/canonicalEcosystemData";

let inMemoryCredentials: VerifiableCredential[] = JSON.parse(
  JSON.stringify(CANONICAL_VERIFIABLE_CREDENTIALS)
);
let inMemoryShareLinks: CredentialShareLink[] = [];

export const credentialRepository = {
  async getCredentialsByHolderId(holderId: string): Promise<VerifiableCredential[]> {
    const list = inMemoryCredentials.filter((c) => c.holderId === holderId);
    return JSON.parse(JSON.stringify(list));
  },

  async getCredentialById(credentialId: string): Promise<VerifiableCredential | null> {
    const found = inMemoryCredentials.find((c) => c.credentialId === credentialId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async issueCredential(cred: VerifiableCredential): Promise<VerifiableCredential> {
    inMemoryCredentials.push(cred);
    return JSON.parse(JSON.stringify(cred));
  },

  async revokeCredential(credentialId: string): Promise<VerifiableCredential | null> {
    const found = inMemoryCredentials.find((c) => c.credentialId === credentialId);
    if (!found) return null;
    found.status = "REVOKED";
    return JSON.parse(JSON.stringify(found));
  },

  async createShareLink(share: CredentialShareLink): Promise<CredentialShareLink> {
    inMemoryShareLinks.push(share);
    return JSON.parse(JSON.stringify(share));
  },

  async getShareLink(shareId: string): Promise<CredentialShareLink | null> {
    const found = inMemoryShareLinks.find((s) => s.shareId === shareId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
};
