import { UserRole } from "@/types";
import { getRoleDefaultRoute } from "./permissions";

const GOVERNMENT_ROLES: UserRole[] = [
  "GOVERNMENT_ADMIN", "NATIONAL_GOVERNMENT", "STATE_GOVERNMENT", "STATE_ADMIN", "DISTRICT_ADMIN",
  "PROGRAM_ADMIN", "PROGRAM_MANAGER", "SCHEME_MANAGER", "SKILL_DEVELOPMENT_ADMIN", "MONITORING_OFFICER", "POLICY_ANALYST",
];

export function getRoleProfileRoute(role?: UserRole): string {
  if (role === "EMPLOYER") return "/employer/profile";
  if (role === "TRAINING_PROVIDER" || role === "ITI_ADMIN" || role === "INSTRUCTOR") return "/training-provider/profile";
  if (role && GOVERNMENT_ROLES.includes(role)) return getRoleDefaultRoute(role);
  if (role === "PLATFORM_ADMIN") return "/admin";
  return "/candidate/profile";
}

export function canAccessRolePath(role: UserRole, pathname: string): boolean {
  if (role === "PLATFORM_ADMIN") return true;
  if (pathname.startsWith("/candidate")) return role === "CANDIDATE";
  if (pathname.startsWith("/employer")) return role === "EMPLOYER";
  if (pathname.startsWith("/training-provider")) return role === "TRAINING_PROVIDER" || role === "ITI_ADMIN" || role === "INSTRUCTOR";
  if (pathname.startsWith("/district-admin")) return role === "DISTRICT_ADMIN" || role === "GOVERNMENT_ADMIN";
  if (pathname.startsWith("/government")) return GOVERNMENT_ROLES.includes(role);
  if (pathname.startsWith("/admin")) return false;
  return true;
}
