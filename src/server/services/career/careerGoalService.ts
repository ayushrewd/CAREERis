import { CareerGoal } from "@/types/careerJourney";
import { careerGoalRepository } from "@/server/repositories/careerGoalRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";

export const careerGoalService = {
  async getGoals(candidateId: string): Promise<CareerGoal[]> {
    return careerGoalRepository.findByCandidateId(candidateId);
  },

  async addGoal(data: Omit<CareerGoal, "id" | "createdAt" | "updatedAt">): Promise<CareerGoal> {
    const role = await roleRepository.findById(data.targetRoleId);
    const targetRoleTitle = data.targetRoleTitle || (role ? role.title : "Technical Specialist");
    const targetIndustryName = data.targetIndustryName || (role ? ((role as any).sector || role.sectorId) : "Technology & Engineering");

    return careerGoalRepository.create({
      ...data,
      targetRoleTitle,
      targetIndustryName,
    });
  },

  async updateGoal(id: string, updates: Partial<CareerGoal>): Promise<CareerGoal | null> {
    return careerGoalRepository.update(id, updates);
  },

  async removeGoal(id: string): Promise<boolean> {
    return careerGoalRepository.delete(id);
  },

  async getPrimaryGoal(candidateId: string): Promise<CareerGoal | null> {
    const goals = await careerGoalRepository.findByCandidateId(candidateId);
    const primary = goals.find((g) => g.priority === "PRIMARY");
    return primary || (goals.length > 0 ? goals[0] : null);
  },
};
