// ==============================================================================
// CAREERIS CAREER TRAJECTORY REPOSITORY
// Candidate Progression Pathways, Transferable Skills & Transition Matrices
// ==============================================================================

import {
  CareerTrajectoryPath,
  CareerTransitionAnalysis,
} from "@/types/predictiveIntelligence";
import {
  CANONICAL_CAREER_TRAJECTORIES,
  CANONICAL_CAREER_TRANSITIONS,
} from "@/data/canonicalCareerTrajectoriesData";

let inMemoryTrajectories: CareerTrajectoryPath[] = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_TRAJECTORIES)
);
let inMemoryTransitions: Record<string, CareerTransitionAnalysis> = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_TRANSITIONS)
);

export const careerTrajectoryRepository = {
  async getTrajectoriesForCandidate(candidateId?: string): Promise<CareerTrajectoryPath[]> {
    if (candidateId) {
      const list = inMemoryTrajectories.filter((t) => t.candidateId === candidateId);
      if (list.length > 0) return JSON.parse(JSON.stringify(list));
    }
    return JSON.parse(JSON.stringify(inMemoryTrajectories));
  },

  async getTrajectoryById(pathId: string): Promise<CareerTrajectoryPath | null> {
    const found = inMemoryTrajectories.find((t) => t.pathId === pathId);
    return found ? JSON.parse(JSON.stringify(found)) : inMemoryTrajectories[0];
  },

  async getTransitionAnalysis(currentRole: string, targetRole: string): Promise<CareerTransitionAnalysis> {
    const key = `${currentRole.toLowerCase().includes("weld") ? "manual-to-robotic-welder" : "electrician-to-bms-calibration"}`;
    const found = inMemoryTransitions[key];
    if (found) return JSON.parse(JSON.stringify(found));

    return {
      currentRole,
      targetRole,
      overallMatchScore: 75,
      transferableSkills: [
        { skillName: "Technical Problem Solving", transferability: "DIRECTLY_TRANSFERABLE", rationale: "Fundamental analytical troubleshooting transfers across roles." },
      ],
      gapSkills: [
        { skillName: "Domain Specific Diagnostic Tools", priority: "HIGH", recommendedTraining: "Specialized vocational upskilling certification." },
      ],
      estimatedTransitionDurationWeeks: 8,
    };
  },
};
