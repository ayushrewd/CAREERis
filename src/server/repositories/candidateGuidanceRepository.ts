// ==============================================================================
// CAREERIS CANDIDATE GUIDANCE REPOSITORY
// Career Discoveries, Transitions, Employability Scorecards & Interview Modules
// ==============================================================================

import {
  PersonalizedCareerDiscoveryRecord,
  CareerTransitionModel,
  CandidateEmployabilityScorecard,
  InterviewPracticeQuestion,
  NextBestActionItem,
} from "@/types/candidateGuidance";
import {
  CANONICAL_CAREER_DISCOVERIES,
  CANONICAL_CAREER_TRANSITIONS,
  CANONICAL_EMPLOYABILITY_SCORECARD,
  CANONICAL_INTERVIEW_QUESTIONS,
} from "@/data/canonicalCandidateGuidanceData";

let inMemoryDiscoveries: PersonalizedCareerDiscoveryRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_DISCOVERIES)
);
let inMemoryTransitions: CareerTransitionModel[] = JSON.parse(
  JSON.stringify(CANONICAL_CAREER_TRANSITIONS)
);
let inMemoryScorecard: CandidateEmployabilityScorecard = JSON.parse(
  JSON.stringify(CANONICAL_EMPLOYABILITY_SCORECARD)
);
let inMemoryQuestions: InterviewPracticeQuestion[] = JSON.parse(
  JSON.stringify(CANONICAL_INTERVIEW_QUESTIONS)
);

export const candidateGuidanceRepository = {
  async getCareerDiscoveries(candidateId?: string): Promise<PersonalizedCareerDiscoveryRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryDiscoveries));
  },

  async getCareerTransitions(): Promise<CareerTransitionModel[]> {
    return JSON.parse(JSON.stringify(inMemoryTransitions));
  },

  async getEmployabilityScorecard(candidateId?: string): Promise<CandidateEmployabilityScorecard> {
    return JSON.parse(JSON.stringify(inMemoryScorecard));
  },

  async updateNextBestAction(actionId: string, isCompleted: boolean): Promise<NextBestActionItem | null> {
    const action = inMemoryScorecard.nextBestActions.find((a) => a.actionId === actionId);
    if (!action) return null;
    action.isCompleted = isCompleted;
    return JSON.parse(JSON.stringify(action));
  },

  async getInterviewQuestions(roleTarget?: string): Promise<InterviewPracticeQuestion[]> {
    if (roleTarget) {
      return JSON.parse(
        JSON.stringify(inMemoryQuestions.filter((q) => q.roleTarget.toLowerCase().includes(roleTarget.toLowerCase())))
      );
    }
    return JSON.parse(JSON.stringify(inMemoryQuestions));
  },
};
