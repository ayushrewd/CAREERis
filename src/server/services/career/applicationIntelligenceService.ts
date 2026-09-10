// ==============================================================================
// CAREERIS APPLICATION INTELLIGENCE SERVICE
// Job Fit Explanation, Rejection Pattern Diagnostics & Strategic Guidance
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { JobRejectionInsight } from "@/types/careerOperatingSystem";

export const applicationIntelligenceService = {
  async getRejectionDiagnostics(candidateId: string): Promise<JobRejectionInsight[]> {
    return careerOperatingSystemRepository.getRejectionInsights(candidateId);
  },
};
