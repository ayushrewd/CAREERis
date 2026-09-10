import { UserRoleType } from "@prisma/client";
import { User, UserRole } from "@/types";

export function toAppRole(role: UserRoleType): UserRole {
  return role as UserRole;
}

export function toPublicUser(user: {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  roleType: UserRoleType;
  isActive: boolean;
  isEmailVerified: boolean;
  preferredLocale: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  candidateProfile?: {
    headline: string | null;
    currentDistrict: string | null;
    location?: string | null;
    targetRole?: string | null;
    educationSummary?: string | null;
    qualification?: string | null;
    experienceSummary?: string | null;
    declaredSkills?: Array<{ name: string }>;
  } | null;
  employerAccount?: { companyName: string } | null;
  trainingProviderAccount?: { organizationName: string } | null;
  governmentPlannerProfile?: { departmentName: string } | null;
}): User {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    companyName: user.employerAccount?.companyName || undefined,
    organizationName: user.trainingProviderAccount?.organizationName || undefined,
    departmentName: user.governmentPlannerProfile?.departmentName || undefined,
    phone: user.phone || undefined,
    avatarUrl: user.avatarUrl || undefined,
    roleType: toAppRole(user.roleType),
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    preferredLocale: user.preferredLocale,
    lastLoginAt: user.lastLoginAt?.toISOString(),
    createdAt: user.createdAt.toISOString(),
    headline: user.candidateProfile?.headline || undefined,
    district: user.candidateProfile?.location || user.candidateProfile?.currentDistrict || undefined,
    targetRole: user.candidateProfile?.targetRole || undefined,
    college: user.candidateProfile?.educationSummary || undefined,
    education: user.candidateProfile?.educationSummary || undefined,
    qualification: user.candidateProfile?.qualification || undefined,
    experience: user.candidateProfile?.experienceSummary || undefined,
    skills: user.candidateProfile?.declaredSkills?.map((skill) => skill.name),
  };
}
