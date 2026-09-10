// ==============================================================================
// CAREERIS TRAINING PLAN REPOSITORY
// District, State & National Capacity Plan Registry
// ==============================================================================

import { TrainingPlanDossier, CANONICAL_TRAINING_PLANS } from "@/data/canonicalTrainingPlansData";

let inMemoryPlans: TrainingPlanDossier[] = JSON.parse(JSON.stringify(CANONICAL_TRAINING_PLANS));

export const trainingPlanRepository = {
  async findByScope(scope: "DISTRICT" | "STATE" | "NATIONAL", id?: string): Promise<TrainingPlanDossier | null> {
    if (scope === "DISTRICT" && id) {
      const found = inMemoryPlans.find((p) => p.scope === "DISTRICT" && (p.districtId === id || p.id === id));
      return found ? JSON.parse(JSON.stringify(found)) : inMemoryPlans[0];
    }
    if (scope === "STATE" && id) {
      const found = inMemoryPlans.find((p) => p.scope === "STATE" && (p.stateCode === id || p.id === id));
      return found ? JSON.parse(JSON.stringify(found)) : inMemoryPlans[1];
    }
    if (scope === "NATIONAL") {
      const found = inMemoryPlans.find((p) => p.scope === "NATIONAL");
      return found ? JSON.parse(JSON.stringify(found)) : inMemoryPlans[2];
    }
    return inMemoryPlans[0] || null;
  },

  async findAll(): Promise<TrainingPlanDossier[]> {
    return JSON.parse(JSON.stringify(inMemoryPlans));
  },
};
