// ==============================================================================
// CAREERIS CAREER TRAJECTORY SERVICE
// Candidate Pathway Modeling, Career Transitions & Transferable Skills Scoring
// ==============================================================================

import { careerTrajectoryRepository } from "@/server/repositories/careerTrajectoryRepository";
import {
  CareerTrajectoryPath,
  CareerTransitionAnalysis,
} from "@/types/predictiveIntelligence";

export const careerTrajectoryService = {
  async getCandidateTrajectories(candidateId?: string): Promise<CareerTrajectoryPath[]> {
    return careerTrajectoryRepository.getTrajectoriesForCandidate(candidateId);
  },

  async getTrajectoryById(pathId: string): Promise<CareerTrajectoryPath | null> {
    return careerTrajectoryRepository.getTrajectoryById(pathId);
  },

  async analyzeCareerTransition(currentRole: string, targetRole: string): Promise<CareerTransitionAnalysis> {
    return careerTrajectoryRepository.getTransitionAnalysis(currentRole, targetRole);
  },

  async getCareerMapGraph(candidateId?: string) {
    const trajectories = await this.getCandidateTrajectories(candidateId);
    return {
      candidateId: candidateId || "cand-rohit-01",
      currentBaseline: "Diploma in Mechatronics / Vocational Baseline",
      totalAvailablePathways: trajectories.length,
      primaryRecommendedPathway: trajectories[0],
      alternativePathways: trajectories.slice(1),
      disclaimer: "Potential pathway based on live skill graph analysis. Not a guarantee of employment.",
    };
  },
};
