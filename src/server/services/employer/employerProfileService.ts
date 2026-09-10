// ==============================================================================
// CAREERIS EMPLOYER PROFILE SERVICE
// Employer Hierarchy, Verification Audit & Organization Units
// ==============================================================================

import { employerProfileRepository } from "@/server/repositories/employerProfileRepository";
import { EmployerProfile, OrganizationUnit, HiringTeamMember, EmployerVerificationStatus } from "@/types/employerIntelligence";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const employerProfileService = {
  async getProfile(employerId = "comp-tata-motors"): Promise<EmployerProfile> {
    const profile = await employerProfileRepository.findById(employerId);
    if (!profile) {
      const all = await employerProfileRepository.findAll();
      return all[0];
    }
    return profile;
  },

  async getAllProfiles(params?: { industryId?: string; stateCode?: string; search?: string }): Promise<EmployerProfile[]> {
    return employerProfileRepository.findAll(params);
  },

  async updateProfile(employerId: string, updates: Partial<EmployerProfile>, auth: RequestAuthContext): Promise<EmployerProfile | null> {
    const updated = await employerProfileRepository.update(employerId, updates);
    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "EMPLOYER_PROFILE_UPDATED",
        entity: "EmployerProfile",
        entityId: employerId,
        details: { fieldsUpdated: Object.keys(updates) },
      });
    }
    return updated;
  },

  async verifyEmployer(
    employerId: string,
    params: {
      status: EmployerVerificationStatus;
      notes?: string;
      auth: RequestAuthContext;
    }
  ): Promise<EmployerProfile | null> {
    const updated = await employerProfileRepository.updateVerification(employerId, {
      status: params.status,
      verifiedAt: new Date().toISOString(),
      verifiedBy: params.auth.fullName,
      verificationNotes: params.notes,
    });

    if (updated) {
      await auditRepository.record({
        userName: params.auth.fullName,
        userRole: params.auth.userRole,
        action: "EMPLOYER_VERIFICATION_STATUS_CHANGED",
        entity: "EmployerProfile",
        entityId: employerId,
        details: { newStatus: params.status, notes: params.notes },
      });
    }
    return updated;
  },

  async addOrganizationUnit(employerId: string, unit: Omit<OrganizationUnit, "id">, auth: RequestAuthContext): Promise<OrganizationUnit | null> {
    const created = await employerProfileRepository.addOrganizationUnit(employerId, unit);
    if (created) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "ORGANIZATION_UNIT_ADDED",
        entity: "OrganizationUnit",
        entityId: created.id,
        details: { unitName: unit.name, type: unit.type },
      });
    }
    return created;
  },

  async addHiringTeamMember(employerId: string, member: Omit<HiringTeamMember, "id">, auth: RequestAuthContext): Promise<HiringTeamMember | null> {
    const created = await employerProfileRepository.addHiringTeamMember(employerId, member);
    if (created) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "HIRING_TEAM_MEMBER_ADDED",
        entity: "HiringTeamMember",
        entityId: created.id,
        details: { memberName: member.fullName, role: member.role },
      });
    }
    return created;
  },
};
