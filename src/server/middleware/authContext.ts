import { NextRequest } from "next/server";
import { UserRole } from "@/types";
import { hasPermission } from "@/lib/rbac";
import { getRequestSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { toAppRole } from "@/server/auth/publicUser";

export async function resolveVerifiedAuthContext(request: NextRequest): Promise<RequestAuthContext> {
  const session = getRequestSession(request);
  if (!session) throw new Error('Authentication required');
  const user = await prisma.user.findFirst({
    where: { id: session.userId, isActive: true, sessions: { some: { token: session.sessionId, expiresAt: { gt: new Date() } } } },
    include: { employerAccount: true, trainingProviderAccount: true },
  });
  if (!user) throw new Error('Authentication required');
  return { userId: user.id, email: user.email, fullName: user.fullName, userRole: toAppRole(user.roleType),
    assignedCompanyId: user.employerAccount?.companyId || undefined,
    assignedProviderId: user.trainingProviderAccount?.trainingProviderId || undefined };
}

export interface RequestAuthContext {
  userId: string;
  userRole: UserRole;
  fullName: string;
  email: string;
  assignedStateCode?: string; // e.g. "MH"
  assignedDistrictId?: string; // e.g. "dist-pune"
  assignedCompanyId?: string; // e.g. "comp-tata-motors"
  assignedProviderId?: string; // e.g. "tp-iti-aundh"
}

/**
 * Resolves the authenticated user from the signed, HTTP-only session cookie.
 * A real request and signed session are required. Production code never falls
 * back to a demo identity.
 */
export function resolveAuthContext(request?: NextRequest): RequestAuthContext {
  if (!request) {
    throw new Error("Authentication required");
  }
  const session = getRequestSession(request);
  if (!session) throw new Error("Authentication required");
  return {
    userId: session.userId,
    userRole: session.userRole,
    fullName: session.fullName,
    email: session.email,
  };
}

/**
 * Returns the authenticated user session if present, or null if unauthenticated.
 */
export function resolveOptionalAuthContext(request?: NextRequest): RequestAuthContext | null {
  if (!request) return null;
  const session = getRequestSession(request);
  if (!session) return null;
  return {
    userId: session.userId,
    userRole: session.userRole,
    fullName: session.fullName,
    email: session.email,
  };
}

/**
 * Enforce minimum RBAC permission on an endpoint.
 */
export function checkPermission(
  auth: RequestAuthContext,
  permission: string
): boolean {
  if (auth.userRole === "PLATFORM_ADMIN") return true;
  return hasPermission(auth.userRole, permission as any);
}

/**
 * Enforce Geographic / Entity Scope authorization.
 */
export function checkScopeAccess(
  auth: RequestAuthContext,
  scope: {
    stateCode?: string;
    districtId?: string;
    companyId?: string;
    providerId?: string;
  }
): boolean {
  if (auth.userRole === "PLATFORM_ADMIN" || auth.userRole === "GOVERNMENT_ADMIN") {
    // Government admin has state or national scope
    if (auth.assignedStateCode && scope.stateCode && auth.assignedStateCode !== scope.stateCode) {
      return false;
    }
    return true;
  }

  if (auth.userRole === "DISTRICT_ADMIN") {
    if (scope.districtId && auth.assignedDistrictId && auth.assignedDistrictId !== scope.districtId) {
      return false;
    }
    return true;
  }

  if (auth.userRole === "EMPLOYER") {
    if (scope.companyId && auth.assignedCompanyId && auth.assignedCompanyId !== scope.companyId) {
      return false;
    }
    return true;
  }

  if (auth.userRole === "TRAINING_PROVIDER") {
    if (scope.providerId && auth.assignedProviderId && auth.assignedProviderId !== scope.providerId) {
      return false;
    }
    return true;
  }

  return true;
}

export const getAuthContext = resolveAuthContext;
