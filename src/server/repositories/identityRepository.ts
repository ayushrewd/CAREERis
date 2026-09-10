// ==============================================================================
// CAREERIS IDENTITY REPOSITORY
// Digital Identity & Multi-Tenant Organization Membership Management
// ==============================================================================

import { OrganizationMembership } from "@/types/ecosystemInteroperability";
import { CANONICAL_ORGANIZATION_MEMBERSHIPS } from "@/data/canonicalEcosystemData";

let inMemoryMemberships: OrganizationMembership[] = JSON.parse(
  JSON.stringify(CANONICAL_ORGANIZATION_MEMBERSHIPS)
);

export const identityRepository = {
  async getMembershipsByUserId(userId: string): Promise<OrganizationMembership[]> {
    const list = inMemoryMemberships.filter((m) => m.userId === userId);
    if (list.length > 0) return JSON.parse(JSON.stringify(list));

    // Fallback membership
    return [
      {
        membershipId: `mem-${userId}`,
        userId,
        organizationId: "org-general-platform",
        organizationName: "CareerIS National Skill Platform",
        organizationType: "PLATFORM_ADMIN",
        roleInOrg: "VERIFIED_MEMBER",
        isActive: true,
        joinedAt: new Date().toISOString(),
      },
    ];
  },

  async getOrganizationMembers(organizationId: string): Promise<OrganizationMembership[]> {
    const list = inMemoryMemberships.filter((m) => m.organizationId === organizationId);
    return JSON.parse(JSON.stringify(list));
  },

  async addMembership(membership: OrganizationMembership): Promise<OrganizationMembership> {
    inMemoryMemberships.push(membership);
    return JSON.parse(JSON.stringify(membership));
  },
};
