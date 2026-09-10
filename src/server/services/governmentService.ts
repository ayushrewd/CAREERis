import { geographyRepository } from "@/server/repositories/geographyRepository";
import { employerRepository } from "@/server/repositories/employerRepository";
import { skillRepository } from "@/server/repositories/skillRepository";

export const governmentService = {
  async getOverviewMetrics(context: "INDIA" | "MAHARASHTRA" | "PUNE" = "INDIA") {
    const metricsMap = {
      INDIA: {
        scopeName: "Pan-India National Intelligence Radar",
        activeDemand: "1.42M Vacancies",
        verifiedTalent: "840K Certified",
        criticalGap: "384K Net Shortage",
        courseHealth: "86.2% Composite",
        topSkill: "Battery Management Systems (BMS) & Electric Powertrain",
        topDistrict: "Pune District (Chakan & Hinjawadi Hubs)",
        statesCount: 36,
        isPilotArea: false,
      },
      MAHARASHTRA: {
        scopeName: "Maharashtra State (SIH Pilot Geography)",
        activeDemand: "320K Vacancies",
        verifiedTalent: "210K Certified",
        criticalGap: "84K Net Shortage",
        courseHealth: "91.4% Composite",
        topSkill: "High-Voltage Battery Calibration & Siemens PLC SCADA",
        topDistrict: "Pune, Chhatrapati Sambhajinagar, Thane",
        statesCount: 1,
        isPilotArea: true,
      },
      PUNE: {
        scopeName: "Pune District & Chakan Industrial Corridor",
        activeDemand: "64.2K Vacancies",
        verifiedTalent: "48.0K Certified",
        criticalGap: "14.8K Net Shortage",
        courseHealth: "94.0% Composite",
        topSkill: "BMS Telemetry & Hardware-in-Loop Calibration",
        topDistrict: "Chakan Phase I-IV & Talegaon MIDC",
        statesCount: 1,
        isPilotArea: true,
      },
    };

    return metricsMap[context];
  },

  async getSkillGaps() {
    return [
      {
        id: "gap-01",
        skillCode: "SKILL-BMS-01",
        skillName: "Battery Management Systems (BMS) & Cell Chemistry",
        category: "Clean Tech & EV Powertrain",
        demandHeadcount: 42500,
        supplyHeadcount: 14200,
        netDeficit: 28300,
        yoyGrowth: 54.2,
        priority: "CRITICAL",
        confidence: 94,
      },
      {
        id: "gap-02",
        skillCode: "SKILL-PLC-02",
        skillName: "Siemens PLC Programming & SCADA Integration",
        category: "Industrial Automation",
        demandHeadcount: 36000,
        supplyHeadcount: 18500,
        netDeficit: 17500,
        yoyGrowth: 38.5,
        priority: "HIGH",
        confidence: 91,
      },
      {
        id: "gap-03",
        skillCode: "SKILL-CNC-03",
        skillName: "5-Axis CNC Precision Machining & Toolpathing",
        category: "Advanced Manufacturing",
        demandHeadcount: 22000,
        supplyHeadcount: 12100,
        netDeficit: 9900,
        yoyGrowth: 24.1,
        priority: "HIGH",
        confidence: 88,
      },
      {
        id: "gap-04",
        skillCode: "SKILL-ROS-04",
        skillName: "ROS 2 Autonomous Guided Vehicle Robotics",
        category: "Robotics & AI",
        demandHeadcount: 14800,
        supplyHeadcount: 3200,
        netDeficit: 11600,
        yoyGrowth: 72.8,
        priority: "CRITICAL",
        confidence: 89,
      },
    ];
  },

  async getEmergingSkills() {
    return [
      {
        id: "emg-01",
        name: "Green Hydrogen Electrolyzer Maintenance",
        sector: "Renewable Energy",
        adoptionMaturity: "EMERGING_ADOPTION",
        projectedDemand2028: "120,000 Jobs",
        curriculumReadiness: "15% ITI Standardized",
        pilotStates: ["Maharashtra", "Gujarat", "Tamil Nadu"],
      },
      {
        id: "emg-02",
        name: "Semiconductor Packaging & Cleanroom Metrology",
        sector: "Electronics Manufacturing",
        adoptionMaturity: "PILOT_PRODUCTION",
        projectedDemand2028: "85,000 Jobs",
        curriculumReadiness: "28% ITI Standardized",
        pilotStates: ["Gujarat", "Karnataka", "Maharashtra"],
      },
      {
        id: "emg-03",
        name: "ROS 2 Autonomous Mobile Robot Fleet Telemetry",
        sector: "Logistics Automation",
        adoptionMaturity: "GROWTH_STAGE",
        projectedDemand2028: "95,000 Jobs",
        curriculumReadiness: "42% ITI Standardized",
        pilotStates: ["Maharashtra", "Tamil Nadu", "Haryana"],
      },
    ];
  },

  async getDistrictPlan() {
    return {
      districtName: "Pune District",
      stateName: "Maharashtra",
      planYear: "2026-2027",
      targetCapacityIncrease: "+2,400 Seats",
      recommendedBudgetINR: "₹38.5 Crore",
      primaryFocusClusters: ["Chakan Automotive Hub", "Talegaon MIDC", "Hinjawadi IT Corridor"],
      modernizationActions: [
        { itiName: "Government ITI Aundh", equipmentAllocated: "EV Powertrain & BMS Test Rig", budgetINR: "₹4.8 Cr" },
        { itiName: "Government ITI Kothrud", equipmentAllocated: "Siemens S7-1500 PLC Simulation Rigs", budgetINR: "₹3.2 Cr" },
        { itiName: "Government ITI Chakan", equipmentAllocated: "5-Axis CNC Milling Station", budgetINR: "₹6.5 Cr" },
      ],
    };
  },
};
