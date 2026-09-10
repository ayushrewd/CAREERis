// ==============================================================================
// CAREERIS IDENTITY SERVICE
// Multi-Tenant Organization Scoping, Membership Resolution & Provider Abstraction
// ==============================================================================

import { identityRepository } from "@/server/repositories/identityRepository";
import { OrganizationMembership } from "@/types/ecosystemInteroperability";

export const identityService = {
  async getUserMemberships(userId: string): Promise<OrganizationMembership[]> {
    return identityRepository.getMembershipsByUserId(userId);
  },

  async getPrimaryOrganizationMembership(userId: string): Promise<OrganizationMembership> {
    const list = await this.getUserMemberships(userId);
    return list[0];
  },

  async isUserInOrg(userId: string, organizationId: string): Promise<boolean> {
    const memberships = await this.getUserMemberships(userId);
    return memberships.some((m) => m.organizationId === organizationId && m.isActive);
  },
};
