import { describe, it, expect } from "vitest";
import { identityService } from "@/server/services/ecosystem/identityService";

describe("Digital Identity & Multi-Tenant Organization Scoping", () => {
  it("should resolve organization memberships for employer and government personas", async () => {
    const empMemberships = await identityService.getUserMemberships("user-emp-01");
    expect(empMemberships.length).toBeGreaterThan(0);
    expect(empMemberships[0].organizationId).toBe("comp-tata-motors");
    expect(empMemberships[0].roleInOrg).toBe("LEAD_TECHNICAL_RECRUITER");
    expect(empMemberships[0].assignedStateCode).toBe("MH");

    const isMember = await identityService.isUserInOrg("user-emp-01", "comp-tata-motors");
    expect(isMember).toBe(true);
  });
});
