import { describe, it, expect } from "vitest";
import { resolveAuthContext, checkPermission, checkScopeAccess, RequestAuthContext } from "../middleware/authContext";

describe("CareerIS Server RBAC and Geographic Scope Authorization", () => {
  it("should reject requests without a signed session", () => {
    expect(() => resolveAuthContext()).toThrow("Authentication required");
  });

  it("should enforce RBAC permissions based on user role", () => {
    const candidateAuth: RequestAuthContext = {
      userId: "user-cand-01",
      userRole: "CANDIDATE",
      fullName: "Rohit Sharma",
      email: "rohit@test.com",
    };

    const employerAuth: RequestAuthContext = {
      userId: "user-emp-01",
      userRole: "EMPLOYER",
      fullName: "Priya Mehta",
      email: "priya@test.com",
    };

    const adminAuth: RequestAuthContext = {
      userId: "user-admin-01",
      userRole: "PLATFORM_ADMIN",
      fullName: "Platform Super Admin",
      email: "admin@careeris.in",
    };

    // Candidate can view jobs and own profile, but cannot post jobs or view admin audit logs
    expect(checkPermission(candidateAuth, "candidate:read_own")).toBe(true);
    expect(checkPermission(candidateAuth, "employer:manage_jobs")).toBe(false);
    expect(checkPermission(candidateAuth, "admin:view_audit_logs")).toBe(false);

    // Employer can post jobs and shortlist candidates
    expect(checkPermission(employerAuth, "employer:manage_jobs")).toBe(true);
    expect(checkPermission(employerAuth, "employer:view_applicants")).toBe(true);

    // Platform Admin has global permissions
    expect(checkPermission(adminAuth, "admin:view_audit_logs")).toBe(true);
    expect(checkPermission(adminAuth, "admin:manage_roles")).toBe(true);
  });

  it("should enforce geographic and organizational scope access control", () => {
    const districtAdminPune: RequestAuthContext = {
      userId: "user-da-01",
      userRole: "DISTRICT_ADMIN",
      fullName: "District Collector Pune",
      email: "collector.pune@gov.in",
      assignedStateCode: "MH",
      assignedDistrictId: "dist-pune",
    };

    const employerTata: RequestAuthContext = {
      userId: "user-emp-01",
      userRole: "EMPLOYER",
      fullName: "Priya Mehta",
      email: "priya@tatamotors.com",
      assignedCompanyId: "comp-tata-motors",
    };

    const nationalAdmin: RequestAuthContext = {
      userId: "user-gov-01",
      userRole: "GOVERNMENT_ADMIN",
      fullName: "National Skill Secretary",
      email: "secretary.msde@gov.in",
    };

    // Pune district admin can access Pune scope but is blocked from Bengaluru scope
    expect(checkScopeAccess(districtAdminPune, { districtId: "dist-pune" })).toBe(true);
    expect(checkScopeAccess(districtAdminPune, { districtId: "dist-bengaluru" })).toBe(false);

    // Employer Tata can access Tata Motors scope but is blocked from Siemens scope
    expect(checkScopeAccess(employerTata, { companyId: "comp-tata-motors" })).toBe(true);
    expect(checkScopeAccess(employerTata, { companyId: "comp-siemens" })).toBe(false);

    // National Admin has pan-India scope across all states and districts
    expect(checkScopeAccess(nationalAdmin, { stateCode: "MH", districtId: "dist-pune" })).toBe(true);
    expect(checkScopeAccess(nationalAdmin, { stateCode: "KA", districtId: "dist-bengaluru" })).toBe(true);
  });
});
