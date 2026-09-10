import { describe, it, expect } from "vitest";
import { securityAuditService } from "@/server/services/security/securityAuditService";

describe("Security Audit Trail & PII Masking Governance", () => {
  it("should mask candidate PII and log immutable audit events", async () => {
    const maskedEmail = securityAuditService.maskPii("rohit.sharma@example.com", "EMAIL");
    expect(maskedEmail).toBe("ro****@example.com");

    const maskedPhone = securityAuditService.maskPii("9876543210", "PHONE");
    expect(maskedPhone).toBe("+91-******3210");

    const event = await securityAuditService.logEvent({
      eventType: "CONSENT_GRANT",
      ipAddress: "127.0.0.1",
      resourceAccessed: "/api/v1/consent",
      status: "SUCCESS",
      details: "Granted application sharing consent.",
    });

    expect(event.eventId).toBeDefined();
    expect(event.status).toBe("SUCCESS");

    const trail = await securityAuditService.getAuditTrail();
    expect(trail.length).toBeGreaterThan(0);
  });
});
