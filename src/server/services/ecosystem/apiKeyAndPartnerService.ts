// ==============================================================================
// CAREERIS API KEY & PARTNER SERVICE
// Granular API Scopes, Rate Limiting & Partner Credential Governance
// ==============================================================================

import { webhookAndApiKeyRepository } from "@/server/repositories/webhookAndApiKeyRepository";
import { ApiKeyRecord, ApiScope } from "@/types/ecosystemInteroperability";

export const apiKeyAndPartnerService = {
  async getPartnerApiKeys(orgId: string): Promise<ApiKeyRecord[]> {
    return webhookAndApiKeyRepository.getApiKeysForOrg(orgId);
  },

  async getAllApiKeys(): Promise<ApiKeyRecord[]> {
    return webhookAndApiKeyRepository.getAllApiKeys();
  },

  async generateApiKey(params: {
    partnerOrganizationId: string;
    partnerName: string;
    scopes: ApiScope[];
    rateLimitPerMinute?: number;
  }): Promise<{ keyRecord: ApiKeyRecord; rawSecret: string }> {
    const rawSecret = `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const keyRecord: ApiKeyRecord = {
      keyId: `key-${Date.now().toString(36)}`,
      partnerOrganizationId: params.partnerOrganizationId,
      partnerName: params.partnerName,
      apiKeyMasked: `pk_live_${params.partnerName.toLowerCase().replace(/\s+/g, "_").slice(0, 8)}_****_${Date.now().toString().slice(-4)}`,
      hashedSecret: "sha256-hashed-api-secret",
      scopes: params.scopes,
      rateLimitPerMinute: params.rateLimitPerMinute || 120,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    const saved = await webhookAndApiKeyRepository.createApiKey(keyRecord);
    return { keyRecord: saved, rawSecret };
  },

  validateScope(keyScopes: ApiScope[], requiredScope: ApiScope): boolean {
    return keyScopes.includes(requiredScope);
  },
};
