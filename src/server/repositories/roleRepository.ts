import { CanonicalRole } from "@/types/skills";
import { CANONICAL_ROLES } from "@/data/canonicalRolesData";

let inMemoryRoles: CanonicalRole[] = JSON.parse(JSON.stringify(CANONICAL_ROLES));

export const roleRepository = {
  async findAll(params?: { sectorId?: string; search?: string }): Promise<CanonicalRole[]> {
    let list = [...inMemoryRoles];
    if (params?.sectorId) {
      list = list.filter((r) => r.sectorId === params.sectorId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.coreSkills.some((s) => s.skillName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async findById(id: string): Promise<CanonicalRole | null> {
    const role = inMemoryRoles.find(
      (r) => r.id.toLowerCase() === id.toLowerCase() || r.code.toLowerCase() === id.toLowerCase()
    );
    return role ? JSON.parse(JSON.stringify(role)) : null;
  },

  async findRolesBySkillId(skillId: string): Promise<CanonicalRole[]> {
    return inMemoryRoles.filter(
      (r) =>
        r.coreSkills.some((s) => s.skillId === skillId) ||
        r.preferredSkills.some((s) => s.skillId === skillId)
    );
  },
};
