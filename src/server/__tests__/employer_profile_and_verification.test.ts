import { describe, it, expect } from "vitest";
import { employerProfileService } from "@/server/services/employer/employerProfileService";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("Employer Intelligence: Profile & Verification", () => {
  const adminAuth: RequestAuthContext = {
    userId: "user-admin-01",
    fullName: "State Verification Officer",
    email: "officer@careeris.gov.in",
    userRole: "GOVERNMENT_ADMIN",
  };

  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  it("retrieves canonical employer profile with multi-location hierarchy", async () => {
    const profile = await employerProfileService.getProfile("comp-tata-motors");
    expect(profile).toBeDefined();
    expect(profile.name).toBe("Tata Motors EV Division");
    expect(profile.operatingLocations.length).toBeGreaterThan(0);
    expect(profile.verification.status).toBe("VERIFIED");
  });

  it("updates employer profile and records audit trail", async () => {
    const updated = await employerProfileService.updateProfile(
      "comp-tata-motors",
      { hiringStatus: "ACTIVELY_HIRING" },
      employerAuth
    );
    expect(updated).not.toBeNull();
    expect(updated!.hiringStatus).toBe("ACTIVELY_HIRING");
  });

  it("allows authorized administrators to verify employer credentials", async () => {
    const verified = await employerProfileService.verifyEmployer("comp-precision-cnc", {
      status: "VERIFIED",
      notes: "MSME Udyam credentials audited successfully.",
      auth: adminAuth,
    });
    expect(verified).not.toBeNull();
    expect(verified!.verification.status).toBe("VERIFIED");
    expect(verified!.verification.verifiedBy).toBe("State Verification Officer");
  });
});
