// ==============================================================================
// CAREERIS CANONICAL TRAINING FUNNEL & MARKET FIT DATA
// 9-Stage Training-to-Employment Funnel, Drop-Off Leakage Analysis & Market Fit
// ==============================================================================

import { TrainingFunnelStage, CourseMarketFitScore } from "@/types/trainingEcosystem";

export const CANONICAL_TRAINING_FUNNEL_STAGES: TrainingFunnelStage[] = [
  {
    stageName: "INTERESTED",
    volume: 1250000,
    conversionRatePercentage: 100,
    dropOffCount: 0,
    dropOffRatePercentage: 0,
  },
  {
    stageName: "ENROLLED",
    volume: 980000,
    conversionRatePercentage: 78.4,
    dropOffCount: 270000,
    dropOffRatePercentage: 21.6,
    primaryLeakageReason: "Seat availability limits and geographic travel distance to specialized ITI labs.",
  },
  {
    stageName: "LEARNING",
    volume: 920000,
    conversionRatePercentage: 93.8,
    dropOffCount: 60000,
    dropOffRatePercentage: 6.2,
    primaryLeakageReason: "Course duration clash with seasonal agricultural/family economic commitments.",
  },
  {
    stageName: "COMPLETED",
    volume: 810000,
    conversionRatePercentage: 88.0,
    dropOffCount: 110000,
    dropOffRatePercentage: 12.0,
    primaryLeakageReason: "Attendance requirements and midterm practical lab assessment failure.",
  },
  {
    stageName: "ASSESSED",
    volume: 760000,
    conversionRatePercentage: 93.8,
    dropOffCount: 50000,
    dropOffRatePercentage: 6.2,
    primaryLeakageReason: "Proctored diagnostic assessment scheduling gaps in remote centers.",
  },
  {
    stageName: "CERTIFIED",
    volume: 685000,
    conversionRatePercentage: 90.1,
    dropOffCount: 75000,
    dropOffRatePercentage: 9.9,
    primaryLeakageReason: "NCVT / SSC standardized passing threshold (70% minimum score).",
  },
  {
    stageName: "VERIFIED",
    volume: 590000,
    conversionRatePercentage: 86.1,
    dropOffCount: 95000,
    dropOffRatePercentage: 13.9,
    primaryLeakageReason: "Candidate delay in uploading verified practical work evidence to Skill Passport.",
  },
  {
    stageName: "AVAILABLE",
    volume: 540000,
    conversionRatePercentage: 91.5,
    dropOffCount: 50000,
    dropOffRatePercentage: 8.5,
    primaryLeakageReason: "Candidates opting for higher diploma education instead of immediate employment.",
  },
  {
    stageName: "PLACED",
    volume: 465000,
    conversionRatePercentage: 86.1,
    dropOffCount: 75000,
    dropOffRatePercentage: 13.9,
    primaryLeakageReason: "Wage mismatch or relocation hesitation to industrial cluster hubs.",
  },
];

export const CANONICAL_COURSE_MARKET_FIT_SCORES: CourseMarketFitScore[] = [
  {
    courseId: "course-bms-lead-01",
    courseTitle: "High-Voltage Electric Powertrain & BMS Specialist (Advanced)",
    overallFitScore: 94,
    marketFitGrade: "HIGH_FIT",
    dimensions: {
      demandVolume: 96,
      skillAlignment: 95,
      placementSuccess: 92,
      employerSatisfaction: 94,
      emergingSkillAdoption: 95,
      curriculumFreshness: 92,
    },
    portfolioClassification: "EXPAND",
    actionRecommendation: "Expand seat capacity by +35% and replicate model across tier-2 industrial clusters.",
  },
  {
    courseId: "course-5axis-cnc-01",
    courseTitle: "5-Axis CNC Precision Machining & Aerospace Tooling Master",
    overallFitScore: 91,
    marketFitGrade: "HIGH_FIT",
    dimensions: {
      demandVolume: 94,
      skillAlignment: 92,
      placementSuccess: 90,
      employerSatisfaction: 91,
      emergingSkillAdoption: 88,
      curriculumFreshness: 90,
    },
    portfolioClassification: "EXPAND",
    actionRecommendation: "Add second shift batches at ITI Aundh and Sanand to meet OEM demand.",
  },
  {
    courseId: "course-edge-ai-01",
    courseTitle: "Industrial IoT & Edge AI Embedded Systems Diploma",
    overallFitScore: 88,
    marketFitGrade: "HIGH_FIT",
    dimensions: {
      demandVolume: 92,
      skillAlignment: 88,
      placementSuccess: 86,
      employerSatisfaction: 89,
      emergingSkillAdoption: 94,
      curriculumFreshness: 88,
    },
    portfolioClassification: "EXPAND",
    actionRecommendation: "Scale enrollment through polytechnic modernizations in Bengaluru and Hyderabad.",
  },
  {
    courseId: "course-legacy-welder-01",
    courseTitle: "General Manual Metal Arc Welder (Legacy Trade)",
    overallFitScore: 42,
    marketFitGrade: "POOR_FIT",
    dimensions: {
      demandVolume: 35,
      skillAlignment: 40,
      placementSuccess: 38,
      employerSatisfaction: 45,
      emergingSkillAdoption: 20,
      curriculumFreshness: 30,
    },
    portfolioClassification: "MODERNIZE",
    actionRecommendation: "Do NOT retire; modernize syllabus into Robotic Spot Welding & Laser Welding.",
  },
];
