import { describe, it, expect } from "vitest";
import { hasPermission, ROLE_PERMISSIONS } from "@/lib/rbac/permissions";
import { UserRole } from "@/types";

describe("Government RBAC & Scope Permissions", () => {
  it("allows NATIONAL_GOVERNMENT to view national intelligence and audit logs", () => {
    expect(hasPermission("NATIONAL_GOVERNMENT", "government:view_national_intelligence")).toBe(true);
    expect(hasPermission("NATIONAL_GOVERNMENT", "government:view_state_analytics")).toBe(true);
    expect(hasPermission("NATIONAL_GOVERNMENT", "admin:view_audit_logs")).toBe(true);
  });

  it("restricts CANDIDATE and EMPLOYER from government policy administration", () => {
    expect(hasPermission("CANDIDATE", "government:view_national_intelligence")).toBe(false);
    expect(hasPermission("EMPLOYER", "government:approve_district_plan")).toBe(false);
  });

  it("allows DISTRICT_ADMIN to manage district plans", () => {
    expect(hasPermission("DISTRICT_ADMIN", "district:manage_district_plan")).toBe(true);
    expect(hasPermission("DISTRICT_ADMIN", "district:view_cluster_analytics")).toBe(true);
  });

  it("allows SKILL_DEVELOPMENT_ADMIN to manage standards and view course health", () => {
    expect(hasPermission("SKILL_DEVELOPMENT_ADMIN", "council:manage_skill_standards")).toBe(true);
    expect(hasPermission("SKILL_DEVELOPMENT_ADMIN", "trainer:view_course_health")).toBe(true);
  });
});
