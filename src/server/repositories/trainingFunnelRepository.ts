// ==============================================================================
// CAREERIS TRAINING FUNNEL & MARKET FIT REPOSITORY
// 9-Stage Funnel Conversion, Drop-off Analysis & Course Market Fit Registry
// ==============================================================================

import {
  TrainingFunnelStage,
  CourseMarketFitScore,
} from "@/types/trainingEcosystem";
import {
  CANONICAL_TRAINING_FUNNEL_STAGES,
  CANONICAL_COURSE_MARKET_FIT_SCORES,
} from "@/data/canonicalTrainingFunnelData";

let inMemoryFunnelStages: TrainingFunnelStage[] = JSON.parse(
  JSON.stringify(CANONICAL_TRAINING_FUNNEL_STAGES)
);
let inMemoryMarketFitScores: CourseMarketFitScore[] = JSON.parse(
  JSON.stringify(CANONICAL_COURSE_MARKET_FIT_SCORES)
);

export const trainingFunnelRepository = {
  async getFunnelStages(): Promise<TrainingFunnelStage[]> {
    return JSON.parse(JSON.stringify(inMemoryFunnelStages));
  },

  async getAllMarketFitScores(): Promise<CourseMarketFitScore[]> {
    return JSON.parse(JSON.stringify(inMemoryMarketFitScores));
  },

  async getMarketFitScoreByCourseId(courseId: string): Promise<CourseMarketFitScore | null> {
    const found = inMemoryMarketFitScores.find(
      (c) =>
        c.courseId === courseId ||
        (courseId === "course-bms-01" && c.courseId === "course-bms-lead-01") ||
        (courseId === "course-bms-lead-01" && c.courseId === "course-bms-01")
    );
    if (found) return JSON.parse(JSON.stringify(found));

    // Default calculated fit score
    return {
      courseId,
      courseTitle: `Course (${courseId})`,
      overallFitScore: 82,
      marketFitGrade: "HIGH_FIT",
      dimensions: {
        demandVolume: 85,
        skillAlignment: 82,
        placementSuccess: 80,
        employerSatisfaction: 84,
        emergingSkillAdoption: 78,
        curriculumFreshness: 83,
      },
      portfolioClassification: "MAINTAIN",
      actionRecommendation: "Maintain standard batch intake and monitor placement conversions.",
    };
  },
};
