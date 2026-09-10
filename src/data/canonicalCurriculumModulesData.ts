// ==============================================================================
// CAREERIS CANONICAL CURRICULUM MODULES DATA
// Course-to-Module-to-Skill Ontological Mapping, Versioning & Gap Evaluations
// ==============================================================================

import { CurriculumModule, CurriculumGapEvaluation } from "@/types/trainingEcosystem";

export const CANONICAL_CURRICULUM_MODULES: CurriculumModule[] = [
  {
    moduleId: "mod-bms-01",
    courseId: "course-bms-lead-01",
    moduleName: "High-Voltage Safety & Battery Pack Architecture",
    description: "HV lockout/tagout protocols, cell chemistry fundamentals (LFP/NMC), thermal runaway prevention.",
    durationHours: 60,
    mappedSkillIds: ["skill-hv-safety", "skill-battery-pack-design"],
    mappedSkillNames: ["High-Voltage Safety Norms", "EV Battery Pack Architecture"],
    learningOutcomes: [
      "Safely de-energize 400V-800V EV battery traction packs",
      "Diagnose cell voltage imbalance and module busbar integrity",
    ],
    assessmentMethodology: "Proctored Hardware Test Bench Diagnostic + Safety Protocol Simulation",
    technologyStack: ["High-Voltage Insulation Multimeter", "CAT IV Safety Rigs"],
    version: "v2.4",
    status: "PUBLISHED",
    lastUpdated: "2026-01-15T10:00:00Z",
    marketRelevanceScore: 98,
  },
  {
    moduleId: "mod-bms-02",
    courseId: "course-bms-lead-01",
    moduleName: "BMS State-of-Charge (SOC) & State-of-Health (SOH) Calibration",
    description: "Kalman filter algorithms, Coulomb counting calibration, CAN bus telemetry logging.",
    durationHours: 80,
    mappedSkillIds: ["skill-bms", "skill-can-bus"],
    mappedSkillNames: ["Battery Management Systems (BMS)", "CAN Bus Communication"],
    learningOutcomes: [
      "Calibrate BMS ECU parameters for regenerative braking curves",
      "Decode CAN DBC telemetry frames for fault codes",
    ],
    assessmentMethodology: "Live ECU Calibration Bench Assessment",
    technologyStack: ["Vector CANoe / CANalyzer", "ETAS INCA Calibration Suite"],
    version: "v2.4",
    status: "PUBLISHED",
    lastUpdated: "2026-01-15T10:00:00Z",
    marketRelevanceScore: 96,
  },
  {
    moduleId: "mod-5axis-01",
    courseId: "course-5axis-cnc-01",
    moduleName: "Multi-Axis CAM Toolpath Generation & G-Code Simulation",
    description: "Simultaneous 5-axis contouring, tool collision checking, hyperMILL / Mastercam CAM post-processing.",
    durationHours: 90,
    mappedSkillIds: ["skill-5axis-cnc", "skill-fanuc-prog"],
    mappedSkillNames: ["5-Axis CNC Precision Machining", "FANUC / Siemens Controller Programming"],
    learningOutcomes: [
      "Generate collision-free multi-axis toolpaths for aerospace impellers and EV housings",
      "Optimize spindle speed and feed rates for titanium and aluminum alloys",
    ],
    assessmentMethodology: "Practical Machining Tolerance Audit (+/- 5 microns)",
    technologyStack: ["Mastercam 5-Axis", "DMG MORI 5-Axis Machine", "Zeiss CMM Inspection"],
    version: "v3.1",
    status: "PUBLISHED",
    lastUpdated: "2025-11-20T10:00:00Z",
    marketRelevanceScore: 94,
  },
  {
    moduleId: "mod-edge-ai-01",
    courseId: "course-edge-ai-01",
    moduleName: "Embedded RTOS & Edge Neural Network Deployment",
    description: "FreeRTOS task scheduling, TensorFlow Lite for Microcontrollers on ARM Cortex-M/R platforms.",
    durationHours: 80,
    mappedSkillIds: ["skill-ai-edge", "skill-embedded-rtos"],
    mappedSkillNames: ["Edge AI & Embedded Firmware", "Automotive RTOS"],
    learningOutcomes: [
      "Deploy quantized anomaly detection model on microcontroller edge node",
      "Implement real-time CAN bus interrupt service routines",
    ],
    assessmentMethodology: "Code Review + Live Hardware Emulation on STM32 / NXP S32K Benches",
    technologyStack: ["TensorFlow Lite", "FreeRTOS", "Keil MDK", "Vector CANoe"],
    version: "v1.2",
    status: "PUBLISHED",
    lastUpdated: "2026-02-01T10:00:00Z",
    marketRelevanceScore: 95,
  },
];

export const CANONICAL_CURRICULUM_GAPS: Record<string, CurriculumGapEvaluation> = {
  "course-bms-lead-01": {
    courseId: "course-bms-lead-01",
    courseTitle: "High-Voltage Electric Powertrain & BMS Specialist (Advanced)",
    freshnessStatus: "FRESH",
    gapScore: 94,
    coveredSkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", coverageStatus: "COVERED" },
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms", coverageStatus: "COVERED" },
      { skillId: "skill-can-bus", skillName: "CAN Bus Communication", coverageStatus: "COVERED" },
    ],
    missingEmployerDemandedSkills: [
      { skillId: "skill-uds-diag", skillName: "UDS Unified Diagnostic Services (ISO 14229)", marketDemandVolume: 2400 },
    ],
    outdatedModulesCount: 0,
    recommendedModifications: [
      "Add 15-hour micro-module on ISO 14229 Unified Diagnostic Services (UDS) over CAN FD.",
    ],
    employerFeedbackSignals: [
      {
        employerName: "Tata Motors EV Division",
        feedbackDate: "2026-01-28",
        missingSkillsNoted: ["UDS Diagnostic Protocol", "CAN FD Telemetry"],
        technologyGaps: "Graduates are excellent with standard CAN; need CAN FD and UDS for 2026 model line.",
        conflictingSignalDetected: false,
      },
    ],
    confidence: 0.96,
  },
  "course-5axis-cnc-01": {
    courseId: "course-5axis-cnc-01",
    courseTitle: "5-Axis CNC Precision Machining & Aerospace Tooling Master",
    freshnessStatus: "FRESH",
    gapScore: 91,
    coveredSkills: [
      { skillId: "skill-5axis-cnc", skillName: "5-Axis CNC Precision Machining", coverageStatus: "COVERED" },
      { skillId: "skill-fanuc-prog", skillName: "FANUC / Siemens Controller Programming", coverageStatus: "COVERED" },
      { skillId: "skill-cmm-inspection", skillName: "Zeiss CMM Inspection", coverageStatus: "COVERED" },
    ],
    missingEmployerDemandedSkills: [
      { skillId: "skill-inconel-machining", skillName: "High-Temp Inconel & Titanium Micro-Milling", marketDemandVolume: 1800 },
    ],
    outdatedModulesCount: 0,
    recommendedModifications: [
      "Introduce 20 hours of high-temperature alloy cutting tool wear dynamics.",
    ],
    employerFeedbackSignals: [
      {
        employerName: "Bharat Forge Precision Components",
        feedbackDate: "2026-02-04",
        missingSkillsNoted: ["Inconel Tool Wear Compensation"],
        technologyGaps: "Needs practical spindle vibration tuning module.",
        conflictingSignalDetected: false,
      },
    ],
    confidence: 0.94,
  },
  "course-legacy-welder-01": {
    courseId: "course-legacy-welder-01",
    courseTitle: "General Manual Metal Arc Welder (Legacy Trade)",
    freshnessStatus: "CRITICAL_UPDATE_REQUIRED",
    gapScore: 38,
    coveredSkills: [
      { skillId: "skill-manual-arc-weld", skillName: "Manual Shielded Metal Arc Welding", coverageStatus: "COVERED" },
      { skillId: "skill-gas-cutting", skillName: "Oxy-Fuel Gas Cutting", coverageStatus: "COVERED" },
    ],
    missingEmployerDemandedSkills: [
      { skillId: "skill-robotics-kinematics", skillName: "Robotic Cell Kinematics & Spot Welding", marketDemandVolume: 3800 },
      { skillId: "skill-laser-weld", skillName: "Automated Fiber Laser Welding", marketDemandVolume: 2200 },
    ],
    outdatedModulesCount: 4,
    recommendedModifications: [
      "Modernize 60% of syllabus into Automated Robotic Cell Programming & Laser Welding.",
    ],
    employerFeedbackSignals: [
      {
        employerName: "Hyundai Motor India / Tier-1 Auto Suppliers",
        feedbackDate: "2026-02-10",
        missingSkillsNoted: ["6-Axis Robot Programming", "Automated Spot Welding Logic"],
        technologyGaps: "Manual welding jobs are decreasing; plants are 92% automated robotic spot welding.",
        conflictingSignalDetected: false,
      },
    ],
    confidence: 0.97,
  },
};
