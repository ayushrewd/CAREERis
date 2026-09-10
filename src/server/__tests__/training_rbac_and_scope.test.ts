import { describe, it, expect } from "vitest";
import { ROLE_PERMISSIONS } from "@/lib/rbac/permissions";
import { DEMO_USERS } from "@/lib/auth/mockUsers";

describe("Training Personas & RBAC Enforcement", () => {
  it("should have correct permissions for ITI_ADMIN and INSTRUCTOR", () => {
    const itiPermissions = ROLE_PERMISSIONS.ITI_ADMIN;
    expect(itiPermissions).toBeDefined();
    expect(itiPermissions).toContain("trainer:manage_courses");
    expect(itiPermissions).toContain("trainer:manage_curriculum");
    expect(itiPermissions).toContain("trainer:manage_equipment");
    expect(itiPermissions).toContain("trainer:view_course_health");

    const instPermissions = ROLE_PERMISSIONS.INSTRUCTOR;
    expect(instPermissions).toBeDefined();
    expect(instPermissions).toContain("trainer:manage_curriculum");
    expect(instPermissions).toContain("trainer:view_course_health");
  });

  it("should support all mock users for training personas", () => {
    expect(DEMO_USERS.ITI_ADMIN).toBeDefined();
    expect(DEMO_USERS.ITI_ADMIN.roleType).toBe("ITI_ADMIN");
    expect(DEMO_USERS.INSTRUCTOR).toBeDefined();
    expect(DEMO_USERS.INSTRUCTOR.roleType).toBe("INSTRUCTOR");
    expect(DEMO_USERS.ASSESSOR).toBeDefined();
    expect(DEMO_USERS.ASSESSOR.roleType).toBe("ASSESSOR");
    expect(DEMO_USERS.STATE_ADMIN).toBeDefined();
    expect(DEMO_USERS.STATE_ADMIN.roleType).toBe("STATE_ADMIN");
    expect(DEMO_USERS.PROGRAM_MANAGER).toBeDefined();
    expect(DEMO_USERS.PROGRAM_MANAGER.roleType).toBe("PROGRAM_MANAGER");
  });
});
