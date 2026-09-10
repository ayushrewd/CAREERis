import { Skill } from "@/types";
import { DEMO_SKILLS } from "@/data/demoData";

let inMemorySkills: Skill[] = [...DEMO_SKILLS];

export const skillRepository = {
  async findAll(params?: {
    search?: string;
    categoryId?: string;
    isEmerging?: boolean;
    isGreenSkill?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Skill[]; total: number }> {
    let items = [...inMemorySkills];

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.aliases?.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (params?.categoryId) {
      items = items.filter((s) => s.categoryId === params.categoryId);
    }
    if (params?.isEmerging !== undefined) {
      items = items.filter((s) => s.isEmerging === params.isEmerging);
    }
    if (params?.isGreenSkill !== undefined) {
      items = items.filter((s) => s.isGreenSkill === params.isGreenSkill);
    }

    const total = items.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async findById(id: string): Promise<Skill | null> {
    const skill = inMemorySkills.find((s) => s.id === id || s.code.toLowerCase() === id.toLowerCase());
    return skill || null;
  },
};
