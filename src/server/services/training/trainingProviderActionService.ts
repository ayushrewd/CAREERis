// ==============================================================================
// CAREERIS TRAINING PROVIDER ACTION SERVICE
// Institute Operational Actions, Equipment Maintenance & Course Upgrades
// ==============================================================================

export interface TrainingActionItem {
  id: string;
  actionType:
    | "MODERNIZE_CURRICULUM"
    | "ADD_SEATS"
    | "HIRE_TRAINER"
    | "RETRAIN_TRAINER"
    | "UPGRADE_LAB"
    | "ADD_EQUIPMENT"
    | "PARTNER_WITH_EMPLOYER";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  evidence: string;
  targetCourseId?: string;
  estimatedCostINR: number;
  expectedOutcome: string;
}

export const trainingProviderActionService = {
  async getInstituteActions(instituteId?: string): Promise<TrainingActionItem[]> {
    return [
      {
        id: "act-01",
        actionType: "MODERNIZE_CURRICULUM",
        priority: "CRITICAL",
        title: "Modernize Manual Welding to Robotic Cell Spot Welding",
        description: "Replace 60% of legacy manual syllabus with 6-Axis FANUC robot simulation & spot welding controller logic.",
        evidence: "Placement dropped to 38% while Oragadam auto suppliers have 3,800 automated robotic cell vacancies.",
        targetCourseId: "course-legacy-welder-01",
        estimatedCostINR: 1400000,
        expectedOutcome: "Restores course health from AT_RISK to HEALTHY with >80% placement rate.",
      },
      {
        id: "act-02",
        actionType: "RETRAIN_TRAINER",
        priority: "HIGH",
        title: "Sponsor 2 Master Instructors for ASDC High-Voltage Battery Training",
        description: "Enroll instructors in 4-week DVET / Tata Motors High-Voltage diagnostic certification.",
        evidence: "4.6x regional BMS deficit in Chakan corridor.",
        targetCourseId: "course-bms-lead-01",
        estimatedCostINR: 350000,
        expectedOutcome: "Enables second batch of 48 BMS calibration technicians.",
      },
      {
        id: "act-03",
        actionType: "ADD_EQUIPMENT",
        priority: "HIGH",
        title: "Procure Vector CANoe Bus Interface Rig",
        description: "Install 4 hardware-in-the-loop test benches at Peenya prototyping lab.",
        evidence: "850 unfilled IoT software engineering positions in Peenya/Whitefield.",
        targetCourseId: "course-edge-ai-01",
        estimatedCostINR: 2800000,
        expectedOutcome: "Unlocks 60 additional Edge AI diploma seats.",
      },
    ];
  },
};
