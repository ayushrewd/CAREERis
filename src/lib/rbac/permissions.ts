import { UserRole } from "@/types";

export type PermissionAction =
  | "candidate:read_own"
  | "candidate:update_own"
  | "candidate:apply_jobs"
  | "candidate:take_assessment"
  | "candidate:submit_evidence"
  | "employer:manage_jobs"
  | "employer:view_applicants"
  | "employer:submit_feedback"
  | "employer:view_demand_signals"
  | "trainer:manage_courses"
  | "trainer:manage_curriculum"
  | "trainer:manage_equipment"
  | "trainer:view_course_health"
  | "government:view_national_intelligence"
  | "government:view_state_analytics"
  | "government:approve_district_plan"
  | "district:manage_district_plan"
  | "district:view_cluster_analytics"
  | "council:manage_skill_standards"
  | "council:publish_surveys"
  | "admin:manage_users"
  | "admin:manage_roles"
  | "admin:view_audit_logs"
  | "admin:manage_system";

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  CANDIDATE: [
    "candidate:read_own",
    "candidate:update_own",
    "candidate:apply_jobs",
    "candidate:take_assessment",
    "candidate:submit_evidence",
  ],
  EMPLOYER: [
    "employer:manage_jobs",
    "employer:view_applicants",
    "employer:submit_feedback",
    "employer:view_demand_signals",
  ],
  TRAINING_PROVIDER: [
    "trainer:manage_courses",
    "trainer:manage_curriculum",
    "trainer:manage_equipment",
    "trainer:view_course_health",
  ],
  ITI_ADMIN: [
    "trainer:manage_courses",
    "trainer:manage_curriculum",
    "trainer:manage_equipment",
    "trainer:view_course_health",
    "district:view_cluster_analytics",
  ],
  INSTRUCTOR: [
    "trainer:manage_curriculum",
    "trainer:view_course_health",
  ],
  ASSESSOR: [
    "candidate:take_assessment",
    "trainer:view_course_health",
  ],
  STATE_ADMIN: [
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  PROGRAM_MANAGER: [
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  GOVERNMENT_ADMIN: [
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  NATIONAL_GOVERNMENT: [
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
    "council:manage_skill_standards",
    "admin:view_audit_logs",
  ],
  STATE_GOVERNMENT: [
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  DISTRICT_ADMIN: [
    "district:manage_district_plan",
    "district:view_cluster_analytics",
  ],
  PROGRAM_ADMIN: [
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  SCHEME_MANAGER: [
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
  ],
  SKILL_DEVELOPMENT_ADMIN: [
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:view_cluster_analytics",
    "council:manage_skill_standards",
    "trainer:view_course_health",
  ],
  MONITORING_OFFICER: [
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "district:view_cluster_analytics",
    "admin:view_audit_logs",
  ],
  POLICY_ANALYST: [
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "district:view_cluster_analytics",
  ],
  INDUSTRY_COUNCIL: [
    "council:manage_skill_standards",
    "council:publish_surveys",
    "employer:view_demand_signals",
  ],
  PLATFORM_ADMIN: [
    "candidate:read_own",
    "candidate:update_own",
    "candidate:apply_jobs",
    "candidate:take_assessment",
    "candidate:submit_evidence",
    "employer:manage_jobs",
    "employer:view_applicants",
    "employer:submit_feedback",
    "employer:view_demand_signals",
    "trainer:manage_courses",
    "trainer:manage_curriculum",
    "trainer:manage_equipment",
    "trainer:view_course_health",
    "government:view_national_intelligence",
    "government:view_state_analytics",
    "government:approve_district_plan",
    "district:manage_district_plan",
    "district:view_cluster_analytics",
    "council:manage_skill_standards",
    "council:publish_surveys",
    "admin:manage_users",
    "admin:manage_roles",
    "admin:view_audit_logs",
    "admin:manage_system",
  ],
};

export function hasPermission(
  userRole: UserRole,
  permission: PermissionAction
): boolean {
  const allowed = ROLE_PERMISSIONS[userRole];
  if (!allowed) return false;
  return allowed.includes(permission);
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "CANDIDATE":
      return "Candidate / Job Seeker";
    case "EMPLOYER":
      return "Company";
    case "TRAINING_PROVIDER":
      return "Training Provider / ITI";
    case "GOVERNMENT_ADMIN":
      return "State / National Administrator";
    case "DISTRICT_ADMIN":
      return "District Skill Planner";
    case "INDUSTRY_COUNCIL":
      return "Sector Skill Council";
    case "PLATFORM_ADMIN":
      return "Platform Super Admin";
    default:
      return role;
  }
}

export function getRoleDefaultRoute(role: UserRole): string {
  switch (role) {
    case "CANDIDATE":
      return "/candidate";
    case "EMPLOYER":
      return "/employer";
    case "TRAINING_PROVIDER":
      return "/training-provider";
    case "GOVERNMENT_ADMIN":
      return "/government";
    case "DISTRICT_ADMIN":
      return "/district-admin";
    case "INDUSTRY_COUNCIL":
      return "/industry-council";
    case "PLATFORM_ADMIN":
      return "/admin";
    default:
      return "/";
  }
}
