// ==============================================================================
// CAREERIS EMPLOYER FEEDBACK & SURVEY SERVICE
// Skill Demand Ingestion, Post-Placement Feedback & Anonymous Benchmarking
// ==============================================================================

import { employerOperationsRepository } from "@/server/repositories/employerOperationsRepository";
import {
  EmployerSkillDemandSurvey,
  EmployerPlacementFeedbackRecord,
  EmployerIndustryBenchmark,
} from "@/types/employerOperations";

export const employerFeedbackAndSurveyService = {
  async getSurveys(employerId: string): Promise<EmployerSkillDemandSurvey[]> {
    return employerOperationsRepository.getSurveys(employerId);
  },

  async submitSurvey(survey: Partial<EmployerSkillDemandSurvey>): Promise<EmployerSkillDemandSurvey> {
    return employerOperationsRepository.submitSurvey(survey);
  },

  async getPlacementFeedback(employerId: string): Promise<EmployerPlacementFeedbackRecord[]> {
    return employerOperationsRepository.getPlacementFeedback(employerId);
  },

  async submitPlacementFeedback(fb: Partial<EmployerPlacementFeedbackRecord>): Promise<EmployerPlacementFeedbackRecord> {
    return employerOperationsRepository.submitPlacementFeedback(fb);
  },

  async getIndustryBenchmarks(employerId: string): Promise<EmployerIndustryBenchmark[]> {
    return employerOperationsRepository.getIndustryBenchmarks(employerId);
  },
};
