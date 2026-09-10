// ==============================================================================
// CAREERIS RESUME INTELLIGENCE SERVICE
// Automated Skill Extraction, Project Parsing & ATS Keyword Alignment
// ==============================================================================

import { careerOperatingSystemRepository } from "@/server/repositories/careerOperatingSystemRepository";
import { ResumeExtractedData, ResumeJobOptimizationResult } from "@/types/careerOperatingSystem";

export const resumeIntelligenceService = {
  async getExtractedResume(candidateId: string): Promise<ResumeExtractedData> {
    return careerOperatingSystemRepository.getResumeExtraction(candidateId);
  },

  async optimizeResumeForJob(params: {
    candidateId: string;
    targetJobId: string;
  }): Promise<ResumeJobOptimizationResult> {
    return careerOperatingSystemRepository.getResumeOptimization(params.candidateId, params.targetJobId);
  },
};
