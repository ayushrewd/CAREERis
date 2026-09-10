import { CandidateProfile, CandidateSkillItem } from "@/types";
import { CANONICAL_PERSONAS } from "@/data/canonicalCandidatePersonas";

let inMemoryCandidates: CandidateProfile[] = JSON.parse(JSON.stringify(CANONICAL_PERSONAS));

export const candidateRepository = {
  async getProfile(userId = "user-cand-01"): Promise<CandidateProfile> {
    const found = inMemoryCandidates.find(
      (c) => c.userId === userId || c.id === userId
    );
    return found ? JSON.parse(JSON.stringify(found)) : JSON.parse(JSON.stringify(inMemoryCandidates[0]));
  },

  async findById(candidateId: string): Promise<CandidateProfile | null> {
    const found = inMemoryCandidates.find(
      (c) => c.id === candidateId || c.userId === candidateId
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async findAll(): Promise<CandidateProfile[]> {
    return JSON.parse(JSON.stringify(inMemoryCandidates));
  },

  async updateProfile(userId: string, updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const idx = inMemoryCandidates.findIndex((c) => c.userId === userId || c.id === userId);
    const targetIdx = idx >= 0 ? idx : 0;

    inMemoryCandidates[targetIdx] = {
      ...inMemoryCandidates[targetIdx],
      ...updates,
      skills: updates.skills || inMemoryCandidates[targetIdx].skills,
      education: updates.education || inMemoryCandidates[targetIdx].education,
      experience: updates.experience || inMemoryCandidates[targetIdx].experience,
      projects: updates.projects || inMemoryCandidates[targetIdx].projects,
      certifications: updates.certifications || inMemoryCandidates[targetIdx].certifications,
    };
    return JSON.parse(JSON.stringify(inMemoryCandidates[targetIdx]));
  },

  async addOrUpdateSkill(userId: string, skill: CandidateSkillItem): Promise<CandidateProfile> {
    const idx = inMemoryCandidates.findIndex((c) => c.userId === userId || c.id === userId);
    const targetIdx = idx >= 0 ? idx : 0;

    const existingIndex = inMemoryCandidates[targetIdx].skills.findIndex((s) => s.skillId === skill.skillId);
    let updatedSkills = [...inMemoryCandidates[targetIdx].skills];
    if (existingIndex >= 0) {
      updatedSkills[existingIndex] = { ...updatedSkills[existingIndex], ...skill };
    } else {
      updatedSkills.push(skill);
    }
    inMemoryCandidates[targetIdx].skills = updatedSkills;
    return JSON.parse(JSON.stringify(inMemoryCandidates[targetIdx]));
  },

  async updateReadinessScore(userId: string, score: number): Promise<CandidateProfile> {
    const idx = inMemoryCandidates.findIndex((c) => c.userId === userId || c.id === userId);
    const targetIdx = idx >= 0 ? idx : 0;
    inMemoryCandidates[targetIdx].readinessScore = score;
    return JSON.parse(JSON.stringify(inMemoryCandidates[targetIdx]));
  },
};
