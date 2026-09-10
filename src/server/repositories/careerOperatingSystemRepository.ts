// ==============================================================================
// CAREERIS CAREER OPERATING SYSTEM REPOSITORY
// Next Best Actions, Multi-Path Simulations, Resumes, Mock Interviews & Milestones
// ==============================================================================

import {
  NextBestAction,
  CareerComparisonResult,
  CareerSimulationPlan,
  ResumeExtractedData,
  ResumeJobOptimizationResult,
  InterviewPrepSession,
  JobRejectionInsight,
  CareerJourneyMilestone,
} from "@/types/careerOperatingSystem";
import {
  CANONICAL_NEXT_BEST_ACTIONS,
  CANONICAL_CAREER_COMPARISON,
  CANONICAL_CAREER_SIMULATION,
  CANONICAL_RESUME_EXTRACTION,
  CANONICAL_RESUME_JOB_OPTIMIZATION,
  CANONICAL_INTERVIEW_PREP_SESSION,
  CANONICAL_REJECTION_INSIGHT,
  CANONICAL_CAREER_JOURNEY_MILESTONES,
} from "@/data/canonicalCareerOperatingSystemData";

let inMemoryActions: NextBestAction[] = JSON.parse(
  JSON.stringify(CANONICAL_NEXT_BEST_ACTIONS)
);
let inMemoryComparison: CareerComparisonResult = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_COMPARISON)
);
let inMemorySimulation: CareerSimulationPlan = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_SIMULATION)
);
let inMemoryResumeExtraction: ResumeExtractedData = JSON.parse(
  JSON.stringify(CANONICAL_RESUME_EXTRACTION)
);
let inMemoryResumeOptimization: ResumeJobOptimizationResult = JSON.parse(
  JSON.stringify(CANONICAL_RESUME_JOB_OPTIMIZATION)
);
let inMemoryInterviewPrep: InterviewPrepSession = JSON.parse(
  JSON.stringify(CANONICAL_INTERVIEW_PREP_SESSION)
);
let inMemoryRejections: JobRejectionInsight[] = [
  JSON.parse(JSON.stringify(CANONICAL_REJECTION_INSIGHT)),
];
let inMemoryJourneyMilestones: CareerJourneyMilestone[] = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_JOURNEY_MILESTONES)
);

export const careerOperatingSystemRepository = {
  async getNextBestActions(candidateId?: string): Promise<NextBestAction[]> {
    return JSON.parse(JSON.stringify(inMemoryActions));
  },

  async getCareerComparison(roleIds?: string[]): Promise<CareerComparisonResult> {
    return JSON.parse(JSON.stringify(inMemoryComparison));
  },

  async getCareerSimulation(candidateId: string, targetRoleId?: string): Promise<CareerSimulationPlan> {
    return JSON.parse(JSON.stringify(inMemorySimulation));
  },

  async getResumeExtraction(candidateId: string): Promise<ResumeExtractedData> {
    return JSON.parse(JSON.stringify(inMemoryResumeExtraction));
  },

  async getResumeOptimization(candidateId: string, targetJobId?: string): Promise<ResumeJobOptimizationResult> {
    return JSON.parse(JSON.stringify(inMemoryResumeOptimization));
  },

  async getInterviewPrepSession(sessionId?: string): Promise<InterviewPrepSession> {
    return JSON.parse(JSON.stringify(inMemoryInterviewPrep));
  },

  async saveInterviewEvaluation(sessionId: string, evaluation: any): Promise<InterviewPrepSession> {
    inMemoryInterviewPrep.evaluations.push(evaluation);
    return JSON.parse(JSON.stringify(inMemoryInterviewPrep));
  },

  async getRejectionInsights(candidateId: string): Promise<JobRejectionInsight[]> {
    return JSON.parse(JSON.stringify(inMemoryRejections));
  },

  async getJourneyMilestones(candidateId: string): Promise<CareerJourneyMilestone[]> {
    return JSON.parse(JSON.stringify(inMemoryJourneyMilestones));
  },
};
