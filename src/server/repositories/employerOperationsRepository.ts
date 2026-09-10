// ==============================================================================
// CAREERIS EMPLOYER OPERATIONS REPOSITORY
// Talent Pools, Workforce Forecasts, Reskilling Pathways, Surveys & Feedback
// ==============================================================================

import {
  EmployerTalentPool,
  WorkforceForecastHorizon,
  WorkforceScenarioSimulation,
  EmployerReskillingPathway,
  TrainingPartnerDetail,
  EmployerSkillDemandSurvey,
  EmployerPlacementFeedbackRecord,
  EmployerIndustryBenchmark,
} from "@/types/employerOperations";
import {
  CANONICAL_TALENT_POOLS,
  CANONICAL_WORKFORCE_FORECASTS,
  CANONICAL_WORKFORCE_SCENARIOS,
  CANONICAL_RESKILLING_PATHWAYS,
  CANONICAL_TRAINING_PARTNERS,
  CANONICAL_EMPLOYER_SURVEY,
  CANONICAL_PLACEMENT_FEEDBACK,
  CANONICAL_INDUSTRY_BENCHMARKS,
} from "@/data/canonicalEmployerOperationsData";

let inMemoryTalentPools: EmployerTalentPool[] = JSON.parse(
  JSON.stringify(CANONICAL_TALENT_POOLS)
);
let inMemoryWorkforceForecasts: WorkforceForecastHorizon[] = JSON.parse(
  JSON.stringify(CANONICAL_WORKFORCE_FORECASTS)
);
let inMemoryWorkforceScenarios: WorkforceScenarioSimulation[] = JSON.parse(
  JSON.stringify(CANONICAL_WORKFORCE_SCENARIOS)
);
let inMemoryReskillingPathways: EmployerReskillingPathway[] = JSON.parse(
  JSON.stringify(CANONICAL_RESKILLING_PATHWAYS)
);
let inMemoryTrainingPartners: TrainingPartnerDetail[] = JSON.parse(
  JSON.stringify(CANONICAL_TRAINING_PARTNERS)
);
let inMemorySurveys: EmployerSkillDemandSurvey[] = [
  JSON.parse(JSON.stringify(CANONICAL_EMPLOYER_SURVEY)),
];
let inMemoryFeedback: EmployerPlacementFeedbackRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_PLACEMENT_FEEDBACK)
);
let inMemoryBenchmarks: EmployerIndustryBenchmark[] = JSON.parse(
  JSON.stringify(CANONICAL_INDUSTRY_BENCHMARKS)
);

export const employerOperationsRepository = {
  async getTalentPools(employerId: string): Promise<EmployerTalentPool[]> {
    return JSON.parse(JSON.stringify(inMemoryTalentPools));
  },

  async createTalentPool(pool: Partial<EmployerTalentPool>): Promise<EmployerTalentPool> {
    const newPool: EmployerTalentPool = {
      poolId: `pool-${Date.now()}`,
      employerId: pool.employerId || "emp-tata-motors",
      name: pool.name || "New Talent Pool",
      description: pool.description || "",
      tags: pool.tags || [],
      candidateCount: pool.candidateIds?.length || 0,
      filterCriteria: pool.filterCriteria || { skills: [] },
      candidateIds: pool.candidateIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryTalentPools.push(newPool);
    return newPool;
  },

  async getWorkforceForecasts(employerId: string): Promise<WorkforceForecastHorizon[]> {
    return JSON.parse(JSON.stringify(inMemoryWorkforceForecasts));
  },

  async getWorkforceScenarios(employerId: string): Promise<WorkforceScenarioSimulation[]> {
    return JSON.parse(JSON.stringify(inMemoryWorkforceScenarios));
  },

  async getReskillingPathways(employerId: string): Promise<EmployerReskillingPathway[]> {
    return JSON.parse(JSON.stringify(inMemoryReskillingPathways));
  },

  async getTrainingPartners(): Promise<TrainingPartnerDetail[]> {
    return JSON.parse(JSON.stringify(inMemoryTrainingPartners));
  },

  async getSurveys(employerId: string): Promise<EmployerSkillDemandSurvey[]> {
    return JSON.parse(JSON.stringify(inMemorySurveys));
  },

  async submitSurvey(survey: Partial<EmployerSkillDemandSurvey>): Promise<EmployerSkillDemandSurvey> {
    const newSurvey: EmployerSkillDemandSurvey = {
      surveyId: `surv-${Date.now()}`,
      employerId: survey.employerId || "emp-tata-motors",
      employerName: survey.employerName || "Tata Motors",
      respondentName: survey.respondentName || "Plant TA Head",
      respondentRole: survey.respondentRole || "Recruitment Lead",
      industry: survey.industry || "Automotive",
      cluster: survey.cluster || "Chakan",
      submissionDate: new Date().toISOString(),
      hiringOutlookNext12Months: survey.hiringOutlookNext12Months || "EXPANDING",
      topCriticalSkillsDemanded: survey.topCriticalSkillsDemanded || [],
      satisfactionWithLocalGraduatesScore: survey.satisfactionWithLocalGraduatesScore || 4.5,
      qualitativeFeedback: survey.qualitativeFeedback || "",
      confidenceScore: 95,
    };
    inMemorySurveys.push(newSurvey);
    return newSurvey;
  },

  async getPlacementFeedback(employerId: string): Promise<EmployerPlacementFeedbackRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryFeedback));
  },

  async submitPlacementFeedback(fb: Partial<EmployerPlacementFeedbackRecord>): Promise<EmployerPlacementFeedbackRecord> {
    const newFb: EmployerPlacementFeedbackRecord = {
      feedbackId: `fb-${Date.now()}`,
      employerId: fb.employerId || "emp-tata-motors",
      employerName: fb.employerName || "Tata Motors",
      candidateId: fb.candidateId || "cand-rohit-01",
      candidateName: fb.candidateName || "Rohit Sharma",
      roleTitle: fb.roleTitle || "EV Battery Specialist",
      placementDate: fb.placementDate || "2025-10-01T09:00:00Z",
      technicalReadinessScore: fb.technicalReadinessScore || 5,
      toolProficiencyScore: fb.toolProficiencyScore || 5,
      workplaceSafetyCompliance: fb.workplaceSafetyCompliance || 5,
      retentionMilestone: fb.retentionMilestone || "RETAINED_180D",
      comments: fb.comments || "",
      submittedAt: new Date().toISOString(),
    };
    inMemoryFeedback.push(newFb);
    return newFb;
  },

  async getIndustryBenchmarks(employerId: string): Promise<EmployerIndustryBenchmark[]> {
    return JSON.parse(JSON.stringify(inMemoryBenchmarks));
  },
};
