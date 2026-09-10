// ==============================================================================
// CAREERIS HIRE VS TRAIN DECISION ENGINE
// Explainable Decision Support (HIRE / TRAIN / PARTNER / RELOCATE / REDEFINE / WAIT)
// ==============================================================================

import { HireVsTrainAnalysis, HireVsTrainDecision, HiringPriority } from "@/types/employerIntelligence";
import { CANONICAL_SKILL_SHORTAGES } from "@/data/canonicalWorkforcePlansData";
import { CANONICAL_TRAINING_PARTNERSHIPS } from "@/data/canonicalTrainingPartnershipsData";

export const hireVsTrainDecisionEngine = {
  async evaluateDecision(params: {
    roleId?: string;
    roleTitle?: string;
    skillId?: string;
    skillName?: string;
    headcountNeeded?: number;
    urgencyLevel?: HiringPriority;
  }): Promise<HireVsTrainAnalysis> {
    const skillId = params.skillId || "skill-bms";
    const roleTitle = params.roleTitle || "Battery Management System (BMS) Calibration Specialist";
    const skillName = params.skillName || "Battery Management Systems (BMS)";
    const headcountNeeded = params.headcountNeeded || 20;
    const urgency = params.urgencyLevel || "URGENT";

    const shortage = CANONICAL_SKILL_SHORTAGES.find((s) => s.skillId === skillId) || CANONICAL_SKILL_SHORTAGES[0];

    let decisionRecommendation: HireVsTrainDecision = "PARTNER";
    if (urgency === "CRITICAL" && shortage.demandSupplyRatio < 2.0) {
      decisionRecommendation = "HIRE";
    } else if (shortage.demandSupplyRatio > 3.0 && headcountNeeded >= 15) {
      decisionRecommendation = "PARTNER";
    } else if (headcountNeeded < 5 && shortage.demandSupplyRatio > 2.0) {
      decisionRecommendation = "TRAIN";
    }

    const availableTrainingPartners = [
      {
        providerId: "tp-iti-aundh",
        providerName: "Government ITI Aundh Center of Excellence",
        courseId: "course-bms-01",
        courseTitle: "High-Voltage BMS Diagnostic & Calibration Lab",
        durationWeeks: 8,
        healthScore: 94,
      },
      {
        providerId: "tp-poly-pune",
        providerName: "Government Polytechnic Pune",
        courseId: "course-plc-01",
        courseTitle: "Industrial Automation & Mechatronics Apprenticeship",
        durationWeeks: 12,
        healthScore: 89,
      },
    ];

    return {
      roleId: params.roleId || "role-bms-lead",
      roleTitle,
      skillId,
      skillName,
      headcountNeeded,
      decisionRecommendation,
      confidenceScore: 0.93,
      decisionFactors: {
        marketTalentAvailability: shortage.demandSupplyRatio > 3.0 ? "LOW" : "MODERATE",
        timeToHireDirectDays: shortage.averageTimeToHireDays || 48,
        timeToUpskillInternalDays: 45,
        averageHiringCostINR: 120000,
        trainingCostPerCandidateINR: 35000,
        localTrainingCapacityAvailable: true,
        urgencyLevel: urgency,
      },
      comparativeAnalysis: {
        directHiringPros: [
          "Zero ramp-up time for experienced technicians",
          "Immediate deployment on high-voltage assembly line",
        ],
        directHiringRisks: [
          `Severe talent scarcity (${shortage.demandSupplyRatio.toFixed(1)}x demand/supply ratio) leads to inflated CTC expectations and poaching risk`,
          `Estimated time to fill open positions directly is ${shortage.averageTimeToHireDays} days`,
        ],
        trainingPipelinePros: [
          "70% lower talent acquisition cost per verified candidate (₹35,000 vs ₹1,20,000 recruitment agency fees)",
          "Bespoke curriculum customization to match exact plant hardware and safety SOPs",
          "High employee retention (92% 1-year retention for sponsored CoE cohorts)",
        ],
        trainingPipelineRisks: [
          "Requires 6-8 weeks lead time for batch completion",
          "Requires dedicated internal trainer hours for shopfloor mentoring",
        ],
      },
      recommendedActionPlan:
        decisionRecommendation === "PARTNER"
          ? "Execute a 60/40 Hybrid Strategy: Directly recruit 8 senior leads immediately to anchor plant operations, while partnering with Government ITI Aundh to sponsor a 24-student CoE cohort for junior technician vacancies."
          : decisionRecommendation === "HIRE"
          ? "Proceed with direct recruitment prioritizing candidates with Verified Skill Passports to minimize technical screening cycles."
          : "Upskill internal mechanical/electrical workforce through modular 60-hour vocational training courses.",
      availableTrainingPartners,
    };
  },
};
