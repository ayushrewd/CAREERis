import { TrainerProfile } from "@/types/decisionIntelligence";
import { CANONICAL_TRAINERS } from "@/data/canonicalTrainersData";

let inMemoryTrainers: TrainerProfile[] = JSON.parse(JSON.stringify(CANONICAL_TRAINERS));

export const trainerRepository = {
  async findAll(params?: {
    instituteId?: string;
    district?: string;
    state?: string;
    skillId?: string;
  }): Promise<TrainerProfile[]> {
    let list = [...inMemoryTrainers];
    if (params?.instituteId) {
      list = list.filter((t) => t.instituteId === params.instituteId);
    }
    if (params?.district) {
      list = list.filter((t) => t.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params?.state) {
      list = list.filter((t) => t.state.toLowerCase() === params.state!.toLowerCase());
    }
    if (params?.skillId) {
      list = list.filter((t) => t.competencies.some((c) => c.skillId === params.skillId));
    }
    return list;
  },

  async findById(id: string): Promise<TrainerProfile | null> {
    const found = inMemoryTrainers.find((t) => t.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<TrainerProfile, "id">): Promise<TrainerProfile> {
    const newTrainer: TrainerProfile = {
      ...data,
      id: `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryTrainers.push(newTrainer);
    return newTrainer;
  },
};
