// ==============================================================================
// CAREERIS CANONICAL EMPLOYER RECRUITMENT DATA
// Ground-Truth Datasets for Skill-First Requisitions, Matching, ATS & Hire-vs-Train
// ==============================================================================

import {
  SkillFirstJobRequisition,
  CandidateMatchResultItem,
  RecruitmentPipelineRecord,
  WorkforceHireVsTrainModel,
} from "@/types/employerRecruitment";

export const CANONICAL_REQUISITIONS: SkillFirstJobRequisition[] = [
  {
    requisitionId: "req-tata-ev-01",
    employerId: "emp-tata-motors",
    employerName: "Tata Motors Passenger Vehicles Ltd",
    title: "EV Battery System Calibration Specialist",
    roleId: "role-bms-specialist",
    roleTitle: "EV Battery System Calibration Specialist",
    industry: "Electric Mobility & Automotive",
    district: "Pune",
    state: "Maharashtra",
    employmentType: "FULL_TIME",
    workMode: "ON_SITE",
    experienceYearsRange: { min: 1, max: 4 },
    salaryRangeINR: { min: 550000, max: 750000 },
    skills: [
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Protocols", minProficiency: "ADVANCED", importance: "MUST_HAVE", weight: 40 },
      { skillId: "skill-can-bus", skillName: "CAN Bus Diagnostics", minProficiency: "ADVANCED", importance: "MUST_HAVE", weight: 35 },
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", minProficiency: "INTERMEDIATE", importance: "IMPORTANT", weight: 25 },
    ],
    healthScore: 95,
    talentAvailabilityEstimate: {
      estimatedPoolCount: 140,
      verifiedTalentCount: 48,
      hiringDifficulty: "HIGH",
      averageTimeToHireDays: 22,
    },
    status: "PUBLISHED",
    createdAt: "2026-02-01T10:00:00Z",
  },
];

export const CANONICAL_CANDIDATE_MATCHES: CandidateMatchResultItem[] = [
  {
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    matchScore: 86,
    classification: "STRONG_MATCH",
    matchedSkills: ["High-Voltage Safety Protocols", "CAN Bus Diagnostics", "Digital Multimeter Operation"],
    partialSkills: ["Thermal Runaway Protocol"],
    missingSkills: ["Battery Management Systems (BMS)"],
    trainabilityIndex: 92,
    evidenceStrength: 90,
    hasVerifiedPassport: true,
    district: "Pune",
    state: "Maharashtra",
    candidateVisibility: "PUBLIC",
  },
  {
    candidateId: "cand-priya-02",
    candidateName: "Priya Nair",
    matchScore: 74,
    classification: "TRAINABLE",
    matchedSkills: ["Electrical Circuits (Basic)", "Digital Multimeter Operation"],
    partialSkills: ["High-Voltage Safety Protocols"],
    missingSkills: ["Battery Management Systems (BMS)", "CAN Bus Diagnostics"],
    trainabilityIndex: 88,
    evidenceStrength: 80,
    hasVerifiedPassport: true,
    district: "Pune",
    state: "Maharashtra",
    candidateVisibility: "PUBLIC",
  },
];

export const CANONICAL_PIPELINE_APPLICATIONS: RecruitmentPipelineRecord[] = [
  {
    applicationId: "app-rohit-tata-01",
    requisitionId: "req-tata-ev-01",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    currentStage: "SHORTLISTED",
    recruiterNotes: ["Verified ASDC Level-5 Badge in High-Voltage Safety.", "Candidate is currently in Pune and ready for onsite interview."],
    interviewScorecard: {
      technicalScore: 94,
      problemSolvingScore: 90,
      verdict: "RECOMMEND_HIRE",
    },
    offerDetails: {
      salaryOfferedINR: 650000,
      status: "DRAFT",
    },
    updatedAt: "2026-02-25T14:00:00Z",
  },
];

export const CANONICAL_HIRE_VS_TRAIN: WorkforceHireVsTrainModel = {
  roleTarget: "EV Battery System Calibration Specialist",
  headcountNeeded: 50,
  hireStrategyCostINR: 14760000, // ₹147.6 Lakhs
  reskillStrategyCostINR: 6300000, // ₹63.0 Lakhs
  hireTimeToProductivityWeeks: 4,
  reskillTimeToProductivityWeeks: 6,
  recommendationVerdict: "HIRE_AND_TRAIN",
  costSavingsPercentage: 57.3,
  riskAssessment: "LOW",
  trainingPartnerMatch: {
    providerId: "inst-iti-aundh-01",
    providerName: "Government ITI Aundh (EV Centre of Excellence)",
    courseTitle: "EV Battery System Diagnostics & Pack Calibration",
    durationWeeks: 4,
    estimatedCostINR: 12000,
  },
};
