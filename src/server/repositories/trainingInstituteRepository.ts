// ==============================================================================
// CAREERIS TRAINING INSTITUTE REPOSITORY
// Pan-India ITI, Polytechnic & Training Centre Profile Registry
// ==============================================================================

import { TrainingInstituteProfile, TrainingInstituteType } from "@/types/trainingEcosystem";
import { CANONICAL_TRAINING_INSTITUTES } from "@/data/canonicalTrainingInstitutesData";

let inMemoryInstitutes: TrainingInstituteProfile[] = JSON.parse(
  JSON.stringify(CANONICAL_TRAINING_INSTITUTES)
);

export const trainingInstituteRepository = {
  async findAll(params?: {
    type?: TrainingInstituteType;
    stateCode?: string;
    districtId?: string;
    search?: string;
  }): Promise<TrainingInstituteProfile[]> {
    let list = [...inMemoryInstitutes];

    if (params?.type) {
      list = list.filter((i) => i.type === params.type);
    }
    if (params?.stateCode) {
      list = list.filter((i) => i.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtId) {
      list = list.filter((i) => i.districtId.toLowerCase() === params.districtId!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.districtName.toLowerCase().includes(q) ||
          i.stateName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async findById(id: string): Promise<TrainingInstituteProfile | null> {
    const found = inMemoryInstitutes.find(
      (i) =>
        i.id === id ||
        i.code.toLowerCase() === id.toLowerCase() ||
        (id === "tp-giti-pune" && i.id === "inst-iti-aundh-pune")
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<TrainingInstituteProfile, "id">): Promise<TrainingInstituteProfile> {
    const newInst: TrainingInstituteProfile = {
      ...data,
      id: `inst-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryInstitutes.unshift(newInst);
    return newInst;
  },

  async updateComponentScores(
    id: string,
    componentScores: Partial<TrainingInstituteProfile["componentScores"]>
  ): Promise<TrainingInstituteProfile | null> {
    const index = inMemoryInstitutes.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const inst = inMemoryInstitutes[index];
    inst.componentScores = { ...inst.componentScores, ...componentScores };

    const vals = Object.values(inst.componentScores);
    inst.overallHealthScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    inst.healthClassification =
      inst.overallHealthScore >= 85
        ? "EXCELLENT"
        : inst.overallHealthScore >= 75
        ? "HEALTHY"
        : inst.overallHealthScore >= 65
        ? "WATCH"
        : "AT_RISK";

    return inst;
  },
};
