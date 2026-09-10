// ==============================================================================
// CAREERIS CANONICAL CANDIDATE GUIDANCE DATA
// Ground-Truth Datasets for Career Discovery, Transitions, Employability & Copilot
// ==============================================================================

import {
  PersonalizedCareerDiscoveryRecord,
  CareerTransitionModel,
  CandidateEmployabilityScorecard,
  InterviewPracticeQuestion,
} from "@/types/candidateGuidance";

export const CANONICAL_CAREER_DISCOVERIES: PersonalizedCareerDiscoveryRecord[] = [
  {
    roleId: "role-bms-specialist",
    roleTitle: "EV Battery System Calibration Specialist",
    industryName: "Electric Mobility & Automotive",
    fitClassification: "BEST_FIT",
    fitScore: 86,
    matchingSkills: ["High-Voltage Safety Protocols", "CAN Bus Diagnostics", "Digital Multimeter Operation"],
    missingSkills: ["Battery Management Systems (BMS)", "Thermal Runaway Protocol"],
    annualDemandVolume: 24000,
    salaryRangeINR: { min: 450000, max: 700000 },
    transitionEaseScore: 88,
    whyItFitsExplanation: "Your certified expertise in High-Voltage Safety and CAN Bus Diagnostics directly fulfills 75% of core plant technical requirements.",
    identifiedRisks: ["Requires hands-on battery pack teardown certification before autonomous live testing."],
  },
  {
    roleId: "role-robotics-tech",
    roleTitle: "Industrial Robotic Cell Technician",
    industryName: "Advanced Manufacturing",
    fitClassification: "ADJACENT_CAREER",
    fitScore: 74,
    matchingSkills: ["Electrical Circuits (Basic)", "Digital Multimeter Operation"],
    missingSkills: ["Industrial Robotics Maintenance", "PLC Ladder Logic"],
    annualDemandVolume: 18000,
    salaryRangeINR: { min: 380000, max: 550000 },
    transitionEaseScore: 70,
    whyItFitsExplanation: "Strong foundational electrical troubleshooting makes robot teach-pendant calibration a short 4-week add-on.",
    identifiedRisks: ["Requires 6 weeks of dual-system CNC apprenticeship for top manufacturing wages."],
  },
  {
    roleId: "role-solar-specialist",
    roleTitle: "Solar PV Grid Integration Specialist",
    industryName: "Renewable Energy",
    fitClassification: "BEST_FIT",
    fitScore: 82,
    matchingSkills: ["AC/DC Wiring Basics", "High-Voltage Safety Protocols"],
    missingSkills: ["Solar PV String Inverter Installation", "Solar SCADA Telemetry Monitoring"],
    annualDemandVolume: 32000,
    salaryRangeINR: { min: 350000, max: 520000 },
    transitionEaseScore: 85,
    whyItFitsExplanation: "Grid-tied solar installations heavily reward certified high-voltage isolation practices.",
    identifiedRisks: ["Requires outdoor rooftop physical safety certification."],
  },
];

export const CANONICAL_CAREER_TRANSITIONS: CareerTransitionModel[] = [
  {
    transitionId: "trans-ice-to-ev-01",
    fromRoleTitle: "ICE Engine Assembly Technician",
    toRoleTitle: "EV Battery System Calibration Specialist",
    skillTransferabilityPercentage: 72,
    sharedSkills: ["Torque Tool Calibration", "Diagnostic Trouble Code (DTC) Reading", "Wiring Harness Inspection"],
    gapSkills: [
      { skillName: "Battery Management Systems (BMS)", importance: "CRITICAL" },
      { skillName: "High-Voltage Safety Protocols", importance: "CRITICAL" },
      { skillName: "Thermal Runaway Protocol", importance: "HIGH" },
    ],
    estimatedLearningWeeks: 4,
    prerequisiteCourses: ["ASDC EV Battery System Diagnostics (ITI Aundh)"],
    marketDemandGrowthPercentage: 48.5,
  },
];

export const CANONICAL_EMPLOYABILITY_SCORECARD: CandidateEmployabilityScorecard = {
  candidateId: "cand-rohit-01",
  overallReadinessScore: 84,
  readinessLevel: "MODERATELY_READY",
  components: {
    skillCoverage: 88,
    evidenceStrength: 85,
    assessmentVerifiedRatio: 90,
    profileCompleteness: 95,
    marketDemandAlignment: 92,
  },
  keyStrengths: [
    "ASDC Verified Badge: High-Voltage Safety Protocols (Level-5)",
    "CAN Bus Telemetry Diagnostics Practical Certification",
    "Verified Apprenticeship at Tata Motors Chakan Facility",
  ],
  primaryGaps: [
    "Battery Management Systems (BMS) Cell Balancing Telemetry",
    "Thermal Runaway Emergency Coolant Isolation",
  ],
  nextBestActions: [
    {
      actionId: "act-01",
      title: "Enroll in 4-Week ITI Aundh EV BMS Batch",
      description: "Bridges your #1 critical skill gap for the Tata Motors requisition.",
      category: "LEARNING",
      priority: "CRITICAL",
      estimatedMinutes: 120,
      targetSkillOrRole: "Battery Management Systems (BMS)",
      isCompleted: false,
    },
    {
      actionId: "act-02",
      title: "Attempt BMS Telemetry Diagnostic Test",
      description: "Take the 15-minute diagnostic exam to earn pre-course credit.",
      category: "ASSESSMENT",
      priority: "HIGH",
      estimatedMinutes: 15,
      targetSkillOrRole: "Battery Management Systems (BMS)",
      isCompleted: false,
    },
    {
      actionId: "act-03",
      title: "Apply to 3 Pre-Matched EV Requisitions in Pune",
      description: "Tata Motors and Mahindra have active openings matching 86% of your profile.",
      category: "JOB_APPLICATION",
      priority: "HIGH",
      estimatedMinutes: 20,
      targetSkillOrRole: "EV Battery System Calibration Specialist",
      isCompleted: false,
    },
  ],
  lastCalculatedAt: "2026-02-27T10:00:00Z",
};

export const CANONICAL_INTERVIEW_QUESTIONS: InterviewPracticeQuestion[] = [
  {
    questionId: "q-int-ev-01",
    roleTarget: "EV Battery System Calibration Specialist",
    questionType: "TECHNICAL",
    questionText: "Walk me through how you isolate an 800V DC high-voltage battery enclosure safely before opening the top service lid.",
    expectedSkills: ["High-Voltage Safety Protocols", "Manual Service Disconnect (MSD)", "CAT-III 1000V Multimeter"],
    sampleAnswerOutline: "1. Turn ignition off and remove 12V auxiliary ground. 2. Disengage Manual Service Disconnect (MSD) and apply Lockout/Tagout. 3. Wait 5 minutes for DC bus capacitor bleed-down. 4. Verify zero voltage using a calibrated CAT-III 1000V probe.",
    scoringRubric: "Candidate must emphasize the 5-minute capacitor discharge wait time and CAT-III probe calibration.",
  },
  {
    questionId: "q-int-ev-02",
    roleTarget: "EV Battery System Calibration Specialist",
    questionType: "SITUATIONAL",
    questionText: "If CAN bus telemetry shows a 120mV cell imbalance under fast DC charging, how do you determine if it's a sensor failure vs a degraded cell?",
    expectedSkills: ["Battery Management Systems (BMS)", "CAN Bus Diagnostics"],
    sampleAnswerOutline: "1. Connect an external differential voltmeter directly to the cell voltage tap. 2. Cross-verify the physical reading against the BMS CAN bus broadcast message. 3. If reading matches, initiate passive balancing cycle; if mismatched, replace voltage sensing harness.",
    scoringRubric: "Must demonstrate physical verification vs digital CANoe message comparison.",
  },
];
