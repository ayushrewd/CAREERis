import { describe, it, expect } from "vitest";
import { consentService } from "@/server/services/ecosystem/consentService";

describe("Purpose-Bound Candidate Consent & Revocation", () => {
  it("should verify active consent grant and permit authorized data access", async () => {
    const isPermitted = await consentService.isDataAccessPermitted(
      "cand-rohit-01",
      "comp-tata-motors",
      "APPLICATION_SHARING"
    );
    expect(isPermitted).toBe(true);

    const isNotPermitted = await consentService.isDataAccessPermitted(
      "cand-rohit-01",
      "comp-unauthorized-xyz",
      "APPLICATION_SHARING"
    );
    expect(isNotPermitted).toBe(false);
  });

  it("should grant new purpose-bound consent and allow instant revocation", async () => {
    const newGrant = await consentService.grantConsent({
      candidateId: "cand-rohit-01",
      granteeId: "comp-mahindra-auto",
      granteeName: "Mahindra & Mahindra Auto",
      granteeType: "EMPLOYER",
      purpose: "EMPLOYER_VISIBILITY",
      dataScope: ["skills:bms"],
      durationDays: 30,
    });

    expect(newGrant.status).toBe("ACTIVE");
    expect(newGrant.expiresAt).toBeDefined();

    const revoked = await consentService.revokeConsent(newGrant.consentId);
    expect(revoked?.status).toBe("REVOKED");
    expect(revoked?.revokedAt).toBeDefined();

    const checkPermitted = await consentService.isDataAccessPermitted(
      "cand-rohit-01",
      "comp-mahindra-auto",
      "EMPLOYER_VISIBILITY"
    );
    expect(checkPermitted).toBe(false);
  });
});
