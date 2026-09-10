import { CareerTimelineEvent } from "@/types/careerJourney";
import { careerTimelineRepository } from "@/server/repositories/careerTimelineRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";

export const careerTimelineService = {
  async getTimeline(candidateId = "user-cand-01"): Promise<CareerTimelineEvent[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    return careerTimelineRepository.findByCandidateId(candidate.id);
  },

  async recordMilestone(event: Omit<CareerTimelineEvent, "id">): Promise<CareerTimelineEvent> {
    return careerTimelineRepository.addEvent(event);
  },
};
