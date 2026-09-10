// ==============================================================================
// CAREERIS WEBHOOK & API KEY REPOSITORY
// Partner Webhooks, Event Outbox, Scopes & Partner API Keys
// ==============================================================================

import {
  WebhookSubscription,
  WebhookDeliveryLog,
  ApiKeyRecord,
} from "@/types/ecosystemInteroperability";
import { CANONICAL_API_KEYS } from "@/data/canonicalEcosystemData";

let inMemoryApiKeys: ApiKeyRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_API_KEYS)
);
let inMemorySubscriptions: WebhookSubscription[] = [
  {
    subscriptionId: "sub-tata-live-01",
    partnerOrganizationId: "comp-tata-motors",
    targetUrl: "https://recruiting.tatamotors.com/webhooks/careeris",
    secretKeyHashed: "$2a$12$e8wF2oY.W9b9.qXm2j7Uuu8Nl1X1sL9mP2.QjK1t3W5v7Z9a0b1c2",
    subscribedEvents: ["CandidateShortlisted", "OfferIssued", "CandidateHired"],
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
  },
];
let inMemoryDeliveries: WebhookDeliveryLog[] = [
  {
    deliveryId: "del-001",
    subscriptionId: "sub-tata-live-01",
    event: "CandidateShortlisted",
    payload: { applicationId: "app-rohit-tata-01", candidateId: "cand-rohit-01" },
    status: "DELIVERED",
    httpStatusCode: 200,
    attemptCount: 1,
    lastAttemptAt: "2026-02-20T08:00:00Z",
  },
];

export const webhookAndApiKeyRepository = {
  async getApiKeysForOrg(orgId: string): Promise<ApiKeyRecord[]> {
    const list = inMemoryApiKeys.filter((k) => k.partnerOrganizationId === orgId);
    return JSON.parse(JSON.stringify(list));
  },

  async getAllApiKeys(): Promise<ApiKeyRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryApiKeys));
  },

  async createApiKey(key: ApiKeyRecord): Promise<ApiKeyRecord> {
    inMemoryApiKeys.push(key);
    return JSON.parse(JSON.stringify(key));
  },

  async getWebhookSubscriptions(orgId?: string): Promise<WebhookSubscription[]> {
    if (orgId) {
      return inMemorySubscriptions.filter((s) => s.partnerOrganizationId === orgId);
    }
    return JSON.parse(JSON.stringify(inMemorySubscriptions));
  },

  async getDeliveryLogs(): Promise<WebhookDeliveryLog[]> {
    return JSON.parse(JSON.stringify(inMemoryDeliveries));
  },

  async recordDelivery(del: WebhookDeliveryLog): Promise<WebhookDeliveryLog> {
    inMemoryDeliveries.push(del);
    return JSON.parse(JSON.stringify(del));
  },
};
