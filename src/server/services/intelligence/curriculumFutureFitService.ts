// ==============================================================================
// CAREERIS CURRICULUM FUTURE-FIT SERVICE
// Course Future-Fit Scoring, Trainer Competency Forecasting & Equipment Demand
// ==============================================================================

import { CurriculumFutureFitEvaluation } from "@/types/predictiveIntelligence";

const CANONICAL_FUTURE_FIT_EVALUATIONS: Record<string, CurriculumFutureFitEvaluation> = {
  "course-bms-lead-01": {
    courseId: "course-bms-lead-01",
    courseTitle: "High-Voltage Electric Powertrain & BMS Specialist (Advanced)",
    futureFitScore: 94,
    futureFitGrade: "FUTURE_READY",
    currentCurriculumSkills: ["High-Voltage Safety Norms", "EV Battery Pack Architecture", "CAN Bus Communication"],
    futureMarketDemandedSkills: ["UDS Diagnostic Protocol (ISO 14229)", "CAN FD Telemetry", "800V DC Fast Charging"],
    trainerCompetenciesForecast: [
      { skillName: "ISO 14229 UDS Diagnostic Protocol", facultyGap: 14 },
    ],
    equipmentDemandForecast: [
      { equipmentCategory: "CAN FD & Automotive Ethernet Diagnostic Interface", upgradeHorizonMonths: 6 },
    ],
  },
  "course-legacy-welder-01": {
    courseId: "course-legacy-welder-01",
    courseTitle: "General Manual Metal Arc Welder (Legacy Trade)",
    futureFitScore: 32,
    futureFitGrade: "CRITICAL_UPDATE",
    currentCurriculumSkills: ["Manual Shielded Metal Arc Welding", "Oxy-Fuel Gas Cutting"],
    futureMarketDemandedSkills: ["6-Axis Robotic Cell Spot Welding", "Automated Fiber Laser Welding"],
    trainerCompetenciesForecast: [
      { skillName: "Robotic Cell Kinematics & Spot Welding", facultyGap: 42 },
    ],
    equipmentDemandForecast: [
      { equipmentCategory: "6-Axis Industrial Robot Arm & Teach Pendant Bench", upgradeHorizonMonths: 3 },
    ],
  },
};

export const curriculumFutureFitService = {
  async getFutureFitEvaluation(courseId: string): Promise<CurriculumFutureFitEvaluation | null> {
    const found = CANONICAL_FUTURE_FIT_EVALUATIONS[courseId];
    if (found) return JSON.parse(JSON.stringify(found));

    return {
      courseId,
      courseTitle: `Vocational Course (${courseId})`,
      futureFitScore: 78,
      futureFitGrade: "NEEDS_UPDATE",
      currentCurriculumSkills: ["Core Technical Competency"],
      futureMarketDemandedSkills: ["Industry 4.0 Digital Interface"],
      trainerCompetenciesForecast: [{ skillName: "Digital Diagnostic Tools", facultyGap: 6 }],
      equipmentDemandForecast: [{ equipmentCategory: "Updated Testing Bench", upgradeHorizonMonths: 12 }],
    };
  },

  async getAllFutureFitEvaluations(): Promise<CurriculumFutureFitEvaluation[]> {
    return Object.values(CANONICAL_FUTURE_FIT_EVALUATIONS);
  },
};
