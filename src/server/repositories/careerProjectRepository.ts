import { ProjectRecommendation } from "@/types/careerJourney";
import { CANONICAL_CAREER_PROJECTS } from "@/data/canonicalCareerProjectsData";

let inMemoryProjects: ProjectRecommendation[] = JSON.parse(JSON.stringify(CANONICAL_CAREER_PROJECTS));

export const careerProjectRepository = {
  async findAll(params?: { targetRoleId?: string; skillId?: string }): Promise<ProjectRecommendation[]> {
    let list = [...inMemoryProjects];
    if (params?.targetRoleId) {
      list = list.filter((p) => p.targetRoleId === params.targetRoleId);
    }
    if (params?.skillId) {
      list = list.filter((p) => p.skillsAddressed.some((s) => s.skillId === params.skillId));
    }
    return list;
  },

  async findById(id: string): Promise<ProjectRecommendation | null> {
    const found = inMemoryProjects.find((p) => p.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async submitEvidence(id: string, evidenceUrl: string): Promise<ProjectRecommendation | null> {
    const idx = inMemoryProjects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    inMemoryProjects[idx] = {
      ...inMemoryProjects[idx],
      isCompleted: true,
      submittedEvidenceUrl: evidenceUrl,
    };
    return inMemoryProjects[idx];
  },
};
