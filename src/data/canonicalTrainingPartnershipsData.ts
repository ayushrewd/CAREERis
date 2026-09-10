// ==============================================================================
// CAREERIS CANONICAL TRAINING PARTNERSHIPS DATA
// Industry-Academia CoE Partnerships & Curriculum Feedback Logs
// ==============================================================================

import { TrainingPartnershipRecord } from "@/types/employerIntelligence";

export const CANONICAL_TRAINING_PARTNERSHIPS: TrainingPartnershipRecord[] = [
  {
    id: "part-tm-iti-aundh",
    employerId: "comp-tata-motors",
    employerName: "Tata Motors EV Division",
    trainingProviderId: "tp-iti-aundh",
    trainingProviderName: "Government ITI Aundh Center of Excellence",
    instituteDistrict: "Pune",
    instituteState: "Maharashtra",
    partnershipType: "SPONSORED_TRAINING",
    focusSkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)" },
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms (ISO 6469 / AIS 038)" },
      { skillId: "skill-can", skillName: "CAN Bus Communication" },
    ],
    enrolledStudentsCount: 120,
    hiredFromCohortCount: 45,
    status: "ACTIVE",
    mouSigningDate: "2025-06-15",
    expiryDate: "2028-06-14",
    details: "Jointly funded high-voltage battery test lab with simulated thermal runaway containment chamber. Direct placement pipeline for top 60% batch scorers.",
  },
  {
    id: "part-bf-don-bosco",
    employerId: "comp-bharat-forge",
    employerName: "Bharat Forge Ltd",
    trainingProviderId: "tp-don-bosco-pune",
    trainingProviderName: "Don Bosco ITI Chinchwad",
    instituteDistrict: "Pune",
    instituteState: "Maharashtra",
    partnershipType: "APPRENTICESHIP",
    focusSkills: [
      { skillId: "skill-cnc-prog", skillName: "CNC Multi-Axis Programming & Machining" },
      { skillId: "skill-gdt", skillName: "GD&T (Geometric Dimensioning & Tolerancing)" },
    ],
    enrolledStudentsCount: 80,
    hiredFromCohortCount: 32,
    status: "ACTIVE",
    mouSigningDate: "2025-08-01",
    expiryDate: "2027-07-31",
    details: "Dual-vocational training model: 3 days classroom + 3 days on Bharat Forge Mundhwa shop floor operating 5-axis Mazak machines with monthly stipend.",
  },
  {
    id: "part-inf-poly-pune",
    employerId: "comp-infosys",
    employerName: "Infosys Engineering Services",
    trainingProviderId: "tp-poly-pune",
    trainingProviderName: "Government Polytechnic Pune",
    instituteDistrict: "Pune",
    instituteState: "Maharashtra",
    partnershipType: "CURRICULUM_FEEDBACK",
    focusSkills: [
      { skillId: "skill-python-ai", skillName: "Python for Industrial AI" },
      { skillId: "skill-opcua", skillName: "MQTT / OPC-UA Protocol" },
    ],
    enrolledStudentsCount: 150,
    hiredFromCohortCount: 28,
    status: "ACTIVE",
    mouSigningDate: "2025-09-10",
    expiryDate: "2028-09-09",
    details: "Curriculum advisory board membership with semi-annual syllabus updates to integrate Edge Docker containerization and industrial sensor telemetry.",
  },
];
