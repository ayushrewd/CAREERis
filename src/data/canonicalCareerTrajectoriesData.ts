// ==============================================================================
// CAREERIS CANONICAL CAREER TRAJECTORIES DATA
// Candidate Pathways, Transferable Skills & Transition Matrices
// ==============================================================================

import {
  CareerTrajectoryPath,
  CareerTransitionAnalysis,
} from "@/types/predictiveIntelligence";

export const CANONICAL_CAREER_TRAJECTORIES: CareerTrajectoryPath[] = [
  {
    pathId: "traj-welder-to-robotic",
    candidateId: "cand-rohit-01",
    targetRoleTitle: "Robotic Welding & Automation Cell Specialist",
    targetIndustry: "Automotive & EV",
    feasibilityScore: 88,
    timeHorizonMonths: 6,
    overallReadinessPercentage: 74,
    steps: [
      {
        stepIndex: 1,
        stepType: "CURRENT_ROLE",
        title: "Manual Welder / Mechanical Draughtsman Baseline",
        description: "Strong understanding of metal metallurgy, weld seam penetration, and engineering blueprints.",
        durationMonths: 0,
        estimatedReadinessScore: 65,
      },
      {
        stepIndex: 2,
        stepType: "SKILL_ACQUISITION",
        title: "Acquire Robotic Cell Kinematics & Spot Welding",
        description: "Complete 120-hour intensive lab module on 6-Axis robot teach pendant programming.",
        durationMonths: 2,
        skillsToAcquire: [
          { skillId: "skill-robotics-kinematics", skillName: "Robotic Cell Kinematics & Spot Welding" },
        ],
        recommendedCourseId: "course-bms-lead-01",
        recommendedCourseName: "Industry 4.0 Robotic Cell Automation Specialist",
        estimatedReadinessScore: 82,
      },
      {
        stepIndex: 3,
        stepType: "ASSESSMENT_VERIFICATION",
        title: "ASDC Level 6 Skill Passport Verification",
        description: "Pass proctored hardware test bench diagnostic on FANUC robotic cell.",
        durationMonths: 1,
        estimatedReadinessScore: 90,
      },
      {
        stepIndex: 4,
        stepType: "TARGET_ROLE",
        title: "Placement: Robotic Welding Cell Specialist",
        description: "Begin verified full-time role at Tier-1 auto component OEM.",
        durationMonths: 3,
        potentialSalaryRangeINR: { min: 450000, max: 750000 },
        estimatedReadinessScore: 94,
      },
    ],
    whyThisPath: [
      "Manual welding skills transfer directly to robotic weld quality inspection (70% metallurgical overlap).",
      "Chakan auto cluster has 3,800 open requisitions with +45% salary premium over manual trades.",
    ],
    disclaimer: "Potential pathway based on live skill graph analysis. Not a guarantee of employment.",
  },
  {
    pathId: "traj-electrician-to-bms",
    candidateId: "cand-rohit-01",
    targetRoleTitle: "EV Battery Management System (BMS) Calibration Specialist",
    targetIndustry: "Automotive & EV",
    feasibilityScore: 92,
    timeHorizonMonths: 4,
    overallReadinessPercentage: 86,
    steps: [
      {
        stepIndex: 1,
        stepType: "CURRENT_ROLE",
        title: "Industrial Electrician / Electronics Technician Baseline",
        description: "Proven circuit testing, multimeters, and basic microcontroller knowledge.",
        durationMonths: 0,
        estimatedReadinessScore: 70,
      },
      {
        stepIndex: 2,
        stepType: "SKILL_ACQUISITION",
        title: "High-Voltage Safety & BMS Calibration",
        description: "Master 400V-800V safety protocols and CAN bus DBC telemetry decoding.",
        durationMonths: 2,
        skillsToAcquire: [
          { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)" },
          { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms" },
        ],
        recommendedCourseId: "course-bms-lead-01",
        recommendedCourseName: "High-Voltage Electric Powertrain & BMS Specialist",
        estimatedReadinessScore: 88,
      },
      {
        stepIndex: 3,
        stepType: "TARGET_ROLE",
        title: "Placement: BMS Calibration Specialist",
        description: "Join Tata Motors EV or Tier-1 pack manufacturer.",
        durationMonths: 2,
        potentialSalaryRangeINR: { min: 750000, max: 1400000 },
        estimatedReadinessScore: 95,
      },
    ],
    whyThisPath: [
      "4.6x regional BMS shortage in Pune & Chennai corridors.",
      "94/100 CareerIS Market Fit index for certified graduates.",
    ],
    disclaimer: "Potential pathway based on live skill graph analysis. Not a guarantee of employment.",
  },
];

export const CANONICAL_CAREER_TRANSITIONS: Record<string, CareerTransitionAnalysis> = {
  "manual-to-robotic-welder": {
    currentRole: "Manual Arc Welder",
    targetRole: "Robotic Welding Specialist",
    overallMatchScore: 78,
    transferableSkills: [
      { skillName: "Weld Bead Geometry & Visual Inspection", transferability: "DIRECTLY_TRANSFERABLE", rationale: "Exact defect identification criteria applies to automated robot seams." },
      { skillName: "Engineering Blueprint Reading", transferability: "DIRECTLY_TRANSFERABLE", rationale: "CAD coordinates and weld symbols match robotics standards." },
      { skillName: "Shielding Gas Mixture Dynamics", transferability: "PARTIALLY_TRANSFERABLE", rationale: "Flow rate regulation is automated but requires diagnostic parameter setting." },
    ],
    gapSkills: [
      { skillName: "6-Axis Teach Pendant Programming", priority: "CRITICAL", recommendedTraining: "FANUC / KUKA 40-hour controller lab" },
      { skillName: "PLC Interlock Logic", priority: "HIGH", recommendedTraining: "Siemens S7-1200 Safety PLC module" },
    ],
    estimatedTransitionDurationWeeks: 8,
  },
  "electrician-to-bms-calibration": {
    currentRole: "Industrial Electrician",
    targetRole: "BMS Calibration Specialist",
    overallMatchScore: 82,
    transferableSkills: [
      { skillName: "Circuit Multimeter Diagnostics", transferability: "DIRECTLY_TRANSFERABLE", rationale: "Voltage and continuity isolation fundamentals remain identical." },
      { skillName: "Relay & Contactor Wiring", transferability: "DIRECTLY_TRANSFERABLE", rationale: "High-voltage pre-charge contactors operate on identical logic." },
    ],
    gapSkills: [
      { skillName: "CAN Bus DBC Frame Decoding", priority: "CRITICAL", recommendedTraining: "Vector CANoe Diagnostics (60 Hours)" },
      { skillName: "Li-Ion State-of-Charge Kalman Filtering", priority: "HIGH", recommendedTraining: "BMS Calibration Lab Benchmark" },
    ],
    estimatedTransitionDurationWeeks: 12,
  },
};
