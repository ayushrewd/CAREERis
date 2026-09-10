// ==============================================================================
// CAREERIS EMPLOYER PROFILE REPOSITORY
// CRUD & Verification Management for Pan-India Employers
// ==============================================================================

import { EmployerProfile, EmployerVerificationRecord, OrganizationUnit, HiringTeamMember } from "@/types/employerIntelligence";
import { CANONICAL_EMPLOYERS } from "@/data/canonicalEmployersData";

let inMemoryProfiles: EmployerProfile[] = JSON.parse(JSON.stringify(CANONICAL_EMPLOYERS));

export const employerProfileRepository = {
  async findAll(params?: { industryId?: string; stateCode?: string; search?: string }): Promise<EmployerProfile[]> {
    let list = [...inMemoryProfiles];
    if (params?.industryId) {
      list = list.filter((e) => e.industryId === params.industryId);
    }
    if (params?.stateCode) {
      list = list.filter((e) => e.headquarters.stateCode === params.stateCode || e.operatingLocations.some((l) => l.stateCode === params.stateCode));
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.legalName.toLowerCase().includes(q) || e.skillsUsed.some((s) => s.toLowerCase().includes(q)));
    }
    return list;
  },

  async findById(id: string): Promise<EmployerProfile | null> {
    const found = inMemoryProfiles.find((e) => e.id.toLowerCase() === id.toLowerCase());
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<EmployerProfile, "id">): Promise<EmployerProfile> {
    const newProfile: EmployerProfile = {
      ...data,
      id: `comp-${Date.now().toString(36)}`,
    };
    inMemoryProfiles.unshift(newProfile);
    return JSON.parse(JSON.stringify(newProfile));
  },

  async update(id: string, updates: Partial<EmployerProfile>): Promise<EmployerProfile | null> {
    const idx = inMemoryProfiles.findIndex((e) => e.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    inMemoryProfiles[idx] = {
      ...inMemoryProfiles[idx],
      ...updates,
    };
    return JSON.parse(JSON.stringify(inMemoryProfiles[idx]));
  },

  async updateVerification(id: string, verification: Partial<EmployerVerificationRecord>): Promise<EmployerProfile | null> {
    const idx = inMemoryProfiles.findIndex((e) => e.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    inMemoryProfiles[idx].verification = {
      ...inMemoryProfiles[idx].verification,
      ...verification,
    };
    return JSON.parse(JSON.stringify(inMemoryProfiles[idx]));
  },

  async addOrganizationUnit(id: string, unit: Omit<OrganizationUnit, "id">): Promise<OrganizationUnit | null> {
    const profile = inMemoryProfiles.find((e) => e.id.toLowerCase() === id.toLowerCase());
    if (!profile) return null;
    const newUnit: OrganizationUnit = {
      ...unit,
      id: `unit-${Date.now().toString(36)}`,
    };
    profile.organizationUnits.push(newUnit);
    return newUnit;
  },

  async addHiringTeamMember(id: string, member: Omit<HiringTeamMember, "id">): Promise<HiringTeamMember | null> {
    const profile = inMemoryProfiles.find((e) => e.id.toLowerCase() === id.toLowerCase());
    if (!profile) return null;
    const newMember: HiringTeamMember = {
      ...member,
      id: `team-${Date.now().toString(36)}`,
    };
    profile.hiringTeam.push(newMember);
    return newMember;
  },
};
