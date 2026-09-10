import { ProjectRecommendation } from "@/types/careerJourney";

export const CANONICAL_CAREER_PROJECTS: ProjectRecommendation[] = [
  {
    id: "proj-bms-01",
    title: "Li-Ion Battery Pack CAN Telemetry & Cell Balancing Lab Rig",
    description: "Design and rig a 12V 4-cell lithium-ion battery management unit with active cell charge equalisation and real-time CAN-bus frame logging.",
    targetRoleId: "role-bms-lead",
    skillsAddressed: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)" },
      { skillId: "skill-can", skillName: "CAN Bus Communication" },
    ],
    difficulty: "INTERMEDIATE",
    estimatedEffortHours: 35,
    toolsRequired: ["Microcontroller (STM32/Arduino)", "Vector CANoe / Peak-CAN Adapter", "Multimeter", "Battery Pack"],
    expectedEvidenceArtifact: "Hardware wiring diagram, CAN bus trace log CSV, and cell balancing verification video/report.",
    assessmentRelevance: "Fulfills 50% practical assessment benchmark for ASDC Level 5 BMS Technician Certification.",
  },
  {
    id: "proj-plc-02",
    title: "Siemens S7-1500 Automated Conveyor Sorting Line Implementation",
    description: "Program ladder logic and structured text on Siemens TIA Portal to control a dual-diverter pneumatic sorting belt with optical part classification.",
    targetRoleId: "role-auto-specialist",
    skillsAddressed: [
      { skillId: "skill-plc", skillName: "PLC Automation & SCADA" },
      { skillId: "skill-scada", skillName: "SCADA Systems" },
    ],
    difficulty: "INTERMEDIATE",
    estimatedEffortHours: 40,
    toolsRequired: ["Siemens TIA Portal v18", "S7-1200 / S7-1500 Controller / PLCSIM", "Pneumatic Rig"],
    expectedEvidenceArtifact: "TIA Portal project file (.zap18), SCADA screen export, and I/O fault recovery verification log.",
    assessmentRelevance: "Directly validates practical competencies required by Siemens Industrial Automation Exam.",
  },
  {
    id: "proj-ros-03",
    title: "Autonomous 6-Axis Cobot Palletizing Node with Computer Vision",
    description: "Implement ROS 2 MoveIt motion planning node to autonomously detect QR-labeled cartons and stack them onto an industrial pallet workbench.",
    targetRoleId: "role-robotics-eng",
    skillsAddressed: [
      { skillId: "skill-ros", skillName: "Industrial Robotics (ROS 2)" },
      { skillId: "skill-py", skillName: "Python" },
    ],
    difficulty: "ADVANCED",
    estimatedEffortHours: 50,
    toolsRequired: ["ROS 2 Humble / Iron", "MoveIt 2", "Universal Robots UR5e / Gazebo Simulation", "OpenCV"],
    expectedEvidenceArtifact: "GitHub workspace repository with ROS 2 node code, launch files, and Gazebo trajectory simulation video.",
    assessmentRelevance: "Qualifies candidate for Tier-1 Cobot Systems Integrator verification badge.",
  },
];
