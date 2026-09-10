// ==============================================================================
// CAREERIS TALENT MATCHING & TRAINABILITY SERVICE
// Multi-Factor Matching, Trainability Indexing & Skill Coverage
// ==============================================================================

import { employerRecruitmentRepository } from "@/server/repositories/employerRecruitmentRepository";
import { CandidateMatchResultItem } from "@/types/employerRecruitment";

export const talentMatchingAndTrainabilityService = {
  async getMatchingCandidates(requisitionId?: string): Promise<CandidateMatchResultItem[]> {
    return employerRecruitmentRepository.getMatchingCandidates(requisitionId);
  },
};
