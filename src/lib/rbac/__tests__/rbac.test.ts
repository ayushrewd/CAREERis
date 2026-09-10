import { describe, it, expect } from "vitest";
import { hasPermission, getRoleDisplayName, getRoleDefaultRoute } from "../permissions";

describe("RBAC System & Permissions Matrix", () => {
  it("should permit CANDIDATE to read own profile and submit evidence", () => {
    expect(hasPermission("CANDIDATE", "candidate:read_own")).toBe(true);
    expect(hasPermission("CANDIDATE", "candidate:submit_evidence")).toBe(true);
  });

  it("should deny CANDIDATE from managing government district plans", () => {
    expect(hasPermission("CANDIDATE", "government:approve_district_plan")).toBe(false);
    expect(hasPermission("CANDIDATE", "admin:manage_system")).toBe(false);
  });

  it("should permit EMPLOYER to manage jobs and view applicants", () => {
    expect(hasPermission("EMPLOYER", "employer:manage_jobs")).toBe(true);
    expect(hasPermission("EMPLOYER", "employer:view_applicants")).toBe(true);
  });

  it("should permit TRAINING_PROVIDER to manage courses and view course health", () => {
    expect(hasPermission("TRAINING_PROVIDER", "trainer:manage_courses")).toBe(true);
    expect(hasPermission("TRAINING_PROVIDER", "trainer:view_course_health")).toBe(true);
  });

  it("should permit PLATFORM_ADMIN all permissions", () => {
    expect(hasPermission("PLATFORM_ADMIN", "admin:manage_system")).toBe(true);
    expect(hasPermission("PLATFORM_ADMIN", "admin:view_audit_logs")).toBe(true);
    expect(hasPermission("PLATFORM_ADMIN", "government:view_national_intelligence")).toBe(true);
  });

  it("should resolve correct default workspace routes for all roles", () => {
    expect(getRoleDefaultRoute("CANDIDATE")).toBe("/candidate");
    expect(getRoleDefaultRoute("EMPLOYER")).toBe("/employer");
    expect(getRoleDefaultRoute("TRAINING_PROVIDER")).toBe("/training-provider");
    expect(getRoleDefaultRoute("GOVERNMENT_ADMIN")).toBe("/government");
    expect(getRoleDefaultRoute("DISTRICT_ADMIN")).toBe("/district-admin");
    expect(getRoleDefaultRoute("INDUSTRY_COUNCIL")).toBe("/industry-council");
    expect(getRoleDefaultRoute("PLATFORM_ADMIN")).toBe("/admin");
  });
});
