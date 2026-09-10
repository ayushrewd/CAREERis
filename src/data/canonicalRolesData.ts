import { CanonicalRole } from "@/types/skills";

export const CANONICAL_ROLES: CanonicalRole[] = [
  {
    id: "role-bms-lead",
    code: "ROLE-BMS-LEAD",
    title: "Battery Systems (BMS) Calibration Specialist",
    description: "Lead engineer responsible for high-voltage battery pack state-of-charge calibration, thermal safety, and vehicle CAN telemetry integration.",
    nsqfLevel: 7,
    sectorId: "sector-auto",
    sectorName: "Automotive & EV",
    coreSkills: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.4 },
      { skillId: "skill-can", skillName: "CAN Bus Communication", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.3 },
      { skillId: "skill-ev-diag", skillName: "EV Powertrain Diagnostics", isMandatory: true, importance: "HIGH", minProficiency: "INTERMEDIATE", weight: 0.2 },
    ],
    preferredSkills: [
      { skillId: "skill-py", skillName: "Python", isMandatory: false, importance: "MEDIUM", minProficiency: "INTERMEDIATE", weight: 0.1 },
    ],
    typicalSalaryRangeINR: { min: 900000, max: 1600000 },
  },
  {
    id: "role-auto-specialist",
    code: "ROLE-AUTO-SPEC",
    title: "Industrial Automation & PLC Specialist",
    description: "Automation engineer designing ladder logic, integrating SCADA systems, and configuring automated manufacturing lines.",
    nsqfLevel: 6,
    sectorId: "sector-mfg",
    sectorName: "Advanced Manufacturing",
    coreSkills: [
      { skillId: "skill-plc", skillName: "Programmable Logic Controllers (PLC)", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.45 },
      { skillId: "skill-scada", skillName: "SCADA Systems", isMandatory: true, importance: "HIGH", minProficiency: "INTERMEDIATE", weight: 0.35 },
    ],
    preferredSkills: [
      { skillId: "skill-ros", skillName: "Industrial Robotics (ROS 2)", isMandatory: false, importance: "MEDIUM", minProficiency: "FOUNDATIONAL", weight: 0.1 },
      { skillId: "skill-cnc", skillName: "CNC Multi-Axis Machining", isMandatory: false, importance: "NICE_TO_HAVE", minProficiency: "FOUNDATIONAL", weight: 0.1 },
    ],
    typicalSalaryRangeINR: { min: 700000, max: 1300000 },
  },
  {
    id: "role-data-analyst",
    code: "ROLE-DATA-ANALYST",
    title: "Data Analyst & BI Specialist",
    description: "Analyst responsible for querying enterprise databases, statistical modeling, and developing executive dashboards in Power BI.",
    nsqfLevel: 6,
    sectorId: "sector-it",
    sectorName: "IT & Digital Technologies",
    coreSkills: [
      { skillId: "skill-sql", skillName: "SQL", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.35 },
      { skillId: "skill-pbi", skillName: "Power BI", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.35 },
      { skillId: "skill-stat", skillName: "Statistics", isMandatory: true, importance: "HIGH", minProficiency: "INTERMEDIATE", weight: 0.2 },
    ],
    preferredSkills: [
      { skillId: "skill-py", skillName: "Python", isMandatory: false, importance: "MEDIUM", minProficiency: "INTERMEDIATE", weight: 0.1 },
    ],
    typicalSalaryRangeINR: { min: 650000, max: 1200000 },
  },
  {
    id: "role-robotics-eng",
    code: "ROLE-ROBOTICS-ENG",
    title: "Autonomous Robotics (ROS 2) Engineer",
    description: "Developer responsible for ROS 2 node architecture, industrial manipulators, kinematic simulation, and robot cell commissioning.",
    nsqfLevel: 7,
    sectorId: "sector-mfg",
    sectorName: "Advanced Manufacturing",
    coreSkills: [
      { skillId: "skill-ros", skillName: "Industrial Robotics (ROS 2)", isMandatory: true, importance: "CRITICAL", minProficiency: "ADVANCED", weight: 0.5 },
      { skillId: "skill-py", skillName: "Python", isMandatory: true, importance: "HIGH", minProficiency: "ADVANCED", weight: 0.3 },
    ],
    preferredSkills: [
      { skillId: "skill-plc", skillName: "Programmable Logic Controllers (PLC)", isMandatory: false, importance: "MEDIUM", minProficiency: "INTERMEDIATE", weight: 0.2 },
    ],
    typicalSalaryRangeINR: { min: 850000, max: 1500000 },
  },
];
