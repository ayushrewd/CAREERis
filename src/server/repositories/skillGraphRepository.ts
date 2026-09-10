import { prisma, isPostgresMode } from "@/server/db/prisma";
import { CanonicalSkill, SkillAlias, SkillRelationship, SkillCategory } from "@/types/skills";
import { CANONICAL_SKILLS, CANONICAL_SKILL_CATEGORIES } from "@/data/canonicalSkillsData";

let inMemorySkills: CanonicalSkill[] = JSON.parse(JSON.stringify(CANONICAL_SKILLS));
let inMemoryCategories: SkillCategory[] = JSON.parse(JSON.stringify(CANONICAL_SKILL_CATEGORIES));

export const skillGraphRepository = {
  async findAll(params?: {
    categoryId?: string;
    search?: string;
    skillType?: string;
    isEmerging?: boolean;
    isGreenSkill?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: CanonicalSkill[]; total: number }> {
    let list = [...inMemorySkills];

    if (params?.categoryId) {
      list = list.filter((s) => s.categoryId === params.categoryId);
    }
    if (params?.skillType) {
      list = list.filter((s) => s.skillType === params.skillType);
    }
    if (params?.isEmerging !== undefined) {
      list = list.filter((s) => s.isEmerging === params.isEmerging);
    }
    if (params?.isGreenSkill !== undefined) {
      list = list.filter((s) => s.isGreenSkill === params.isGreenSkill);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.aliases.some((a) => a.alias.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = list.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async findById(id: string): Promise<CanonicalSkill | null> {
    const s = inMemorySkills.find(
      (skill) =>
        skill.id.toLowerCase() === id.toLowerCase() ||
        skill.code.toLowerCase() === id.toLowerCase() ||
        skill.normalizedName.toLowerCase() === id.toLowerCase()
    );
    return s ? JSON.parse(JSON.stringify(s)) : null;
  },

  async findByNormalizedName(normalizedName: string): Promise<CanonicalSkill | null> {
    const clean = normalizedName.toLowerCase().trim();
    const s = inMemorySkills.find(
      (skill) =>
        skill.normalizedName === clean ||
        skill.canonicalName.toLowerCase() === clean ||
        skill.name.toLowerCase() === clean
    );
    return s ? JSON.parse(JSON.stringify(s)) : null;
  },

  async findByAlias(normalizedAlias: string): Promise<{ skill: CanonicalSkill; alias: SkillAlias } | null> {
    const clean = normalizedAlias.toLowerCase().trim();
    for (const s of inMemorySkills) {
      const matchedAlias = s.aliases.find(
        (a) => a.normalizedAlias === clean || a.alias.toLowerCase().trim() === clean
      );
      if (matchedAlias) {
        return { skill: JSON.parse(JSON.stringify(s)), alias: matchedAlias };
      }
    }
    return null;
  },

  async create(data: Omit<CanonicalSkill, "id" | "createdAt" | "updatedAt" | "aliases" | "outgoingRelations" | "incomingRelations">): Promise<CanonicalSkill> {
    const newSkill: CanonicalSkill = {
      ...data,
      id: `skill-${Date.now().toString(36)}`,
      aliases: [],
      outgoingRelations: [],
      incomingRelations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemorySkills.push(newSkill);
    return newSkill;
  },

  async update(id: string, updates: Partial<CanonicalSkill>): Promise<CanonicalSkill | null> {
    const index = inMemorySkills.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return null;

    inMemorySkills[index] = {
      ...inMemorySkills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return inMemorySkills[index];
  },

  async addAlias(skillId: string, aliasData: Omit<SkillAlias, "id" | "skillId" | "createdAt">): Promise<SkillAlias | null> {
    const skill = inMemorySkills.find((s) => s.id === skillId || s.code === skillId);
    if (!skill) return null;

    const newAlias: SkillAlias = {
      ...aliasData,
      id: `al-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      skillId: skill.id,
      createdAt: new Date().toISOString(),
    };
    skill.aliases.push(newAlias);
    return newAlias;
  },

  async addRelationship(sourceSkillId: string, relData: Omit<SkillRelationship, "id" | "sourceSkillId" | "createdAt">): Promise<SkillRelationship | null> {
    const sourceSkill = inMemorySkills.find((s) => s.id === sourceSkillId || s.code === sourceSkillId);
    const targetSkill = inMemorySkills.find((s) => s.id === relData.targetSkillId || s.code === relData.targetSkillId);
    if (!sourceSkill || !targetSkill) return null;

    const newRel: SkillRelationship = {
      ...relData,
      id: `rel-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      sourceSkillId: sourceSkill.id,
      targetSkillName: targetSkill.name,
      createdAt: new Date().toISOString(),
    };
    sourceSkill.outgoingRelations.push(newRel);

    targetSkill.incomingRelations.push({
      id: newRel.id,
      sourceSkillId: sourceSkill.id,
      targetSkillId: targetSkill.id,
      targetSkillName: sourceSkill.name,
      relationType: relData.relationType,
      weight: relData.weight,
      confidence: relData.confidence,
      source: relData.source,
      createdAt: newRel.createdAt,
    });

    return newRel;
  },

  async mergeSkills(primarySkillId: string, secondarySkillId: string): Promise<{ success: boolean; primarySkill: CanonicalSkill }> {
    const primary = inMemorySkills.find((s) => s.id === primarySkillId || s.code === primarySkillId);
    const secondary = inMemorySkills.find((s) => s.id === secondarySkillId || s.code === secondarySkillId);

    if (!primary || !secondary) {
      throw new Error("Invalid skill IDs for merge");
    }

    // 1. Convert secondary name to an alias of primary
    primary.aliases.push({
      id: `al-merge-${Date.now().toString(36)}`,
      skillId: primary.id,
      alias: secondary.name,
      normalizedAlias: secondary.normalizedName,
      source: "MERGE_OPERATION",
      confidence: 1.0,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    });

    // 2. Adopt secondary aliases
    secondary.aliases.forEach((a) => {
      if (!primary.aliases.some((pa) => pa.normalizedAlias === a.normalizedAlias)) {
        primary.aliases.push({ ...a, skillId: primary.id });
      }
    });

    // 3. Adopt outgoing relationships
    secondary.outgoingRelations.forEach((r) => {
      if (r.targetSkillId !== primary.id && !primary.outgoingRelations.some((pr) => pr.targetSkillId === r.targetSkillId)) {
        primary.outgoingRelations.push({ ...r, sourceSkillId: primary.id });
      }
    });

    // 4. Mark secondary as DEPRECATED or remove
    secondary.status = "DEPRECATED";

    return { success: true, primarySkill: primary };
  },

  async getCategories(): Promise<SkillCategory[]> {
    return inMemoryCategories;
  },
};
