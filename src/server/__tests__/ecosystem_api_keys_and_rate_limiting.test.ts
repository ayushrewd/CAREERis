import { describe, it, expect } from "vitest";
import { apiKeyAndPartnerService } from "@/server/services/ecosystem/apiKeyAndPartnerService";

describe("Partner API Keys & Scope Governance", () => {
  it("should generate scoped API keys and validate access scopes", async () => {
    const { keyRecord, rawSecret } = await apiKeyAndPartnerService.generateApiKey({
      partnerOrganizationId: "comp-tata-motors",
      partnerName: "Tata Motors PV Ltd",
      scopes: ["jobs:read", "credentials:verify"],
      rateLimitPerMinute: 120,
    });

    expect(keyRecord.status).toBe("ACTIVE");
    expect(keyRecord.apiKeyMasked).toContain("pk_live_");
    expect(rawSecret).toContain("sk_live_");

    const hasRead = apiKeyAndPartnerService.validateScope(keyRecord.scopes, "jobs:read");
    expect(hasRead).toBe(true);

    const hasWrite = apiKeyAndPartnerService.validateScope(keyRecord.scopes, "training:write");
    expect(hasWrite).toBe(false);
  });
});
