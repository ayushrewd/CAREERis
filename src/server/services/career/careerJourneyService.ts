// ==============================================================================
// CAREERIS CAREER JOURNEY SERVICE
// Longitudinal Milestone Tracking from Skill Acquisition to 365-Day Retention
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { CareerJourneyMilestone } from "@/types/careerOperatingSystem";

export const careerJourneyService = {
  async getJourneyMilestones(candidateId: string): Promise<CareerJourneyMilestone[]> {
    return careerOperatingSystemRepository.getJourneyMilestones(candidateId);
  },
};
