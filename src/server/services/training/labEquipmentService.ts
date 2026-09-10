// ==============================================================================
// CAREERIS LAB & EQUIPMENT INTELLIGENCE SERVICE
// Lab Utilization, Equipment Readiness & Failure Impact Simulator (Mandatory SIMULATION Label)
// ==============================================================================

import { equipmentRepository } from "@/server/repositories/equipmentRepository";
import {
  LabDetail,
  EquipmentDetail,
  EquipmentFailureSimulationResult,
} from "@/types/trainingEcosystem";

const CANONICAL_LABS: LabDetail[] = [
  {
    labId: "lab-pune-bms-01",
    labName: "Advanced EV Powertrain & Battery Testing Lab",
    instituteId: "inst-iti-aundh-pune",
    instituteName: "Government ITI Aundh, Pune",
    capacityWorkstations: 24,
    operationalStatus: "FULLY_OPERATIONAL",
    utilizationStatus: "OPTIMAL",
    utilizationRatePercentage: 88,
    supportedSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Norms", "CAN Bus Communication"],
    supportedCourses: ["course-bms-lead-01", "course-bms-01"],
    equipmentItemsCount: 8,
    lastInspectedAt: "2026-02-10T10:00:00Z",
  },
  {
    labId: "lab-pune-cnc-01",
    labName: "5-Axis CNC Precision Machining Center",
    instituteId: "inst-iti-aundh-pune",
    instituteName: "Government ITI Aundh, Pune",
    capacityWorkstations: 16,
    operationalStatus: "FULLY_OPERATIONAL",
    utilizationStatus: "OPTIMAL",
    utilizationRatePercentage: 92,
    supportedSkills: ["5-Axis CNC Precision Machining", "FANUC / Siemens Programming", "CMM Inspection"],
    supportedCourses: ["course-5axis-cnc-01"],
    equipmentItemsCount: 6,
    lastInspectedAt: "2026-02-12T11:00:00Z",
  },
  {
    labId: "lab-bengaluru-edge-01",
    labName: "Industrial IoT & Edge AI Prototyping Bay",
    instituteId: "inst-polytechnic-bengaluru",
    instituteName: "Government Polytechnic Bengaluru",
    capacityWorkstations: 30,
    operationalStatus: "FULLY_OPERATIONAL",
    utilizationStatus: "OPTIMAL",
    utilizationRatePercentage: 85,
    supportedSkills: ["Edge AI & Embedded Firmware", "Automotive RTOS", "Vector CANoe Diagnostics"],
    supportedCourses: ["course-edge-ai-01"],
    equipmentItemsCount: 12,
    lastInspectedAt: "2026-02-08T14:00:00Z",
  },
];

const CANONICAL_EQUIPMENT_DETAILS: EquipmentDetail[] = [
  {
    id: "eq-bms-test-rig-01",
    labId: "lab-pune-bms-01",
    labName: "Advanced EV Powertrain & Battery Testing Lab",
    instituteId: "inst-iti-aundh-pune",
    equipmentName: "High-Voltage Traction Battery Pack Diagnostic & Cell Cycling Station",
    category: "EV Hardware",
    totalQuantity: 4,
    operationalQuantity: 4,
    maintenanceStatus: "OPERATIONAL",
    readinessStatus: "READY",
    ageYears: 1.2,
    supportedSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Norms"],
    supportedCourses: ["course-bms-lead-01"],
  },
  {
    id: "eq-5axis-dmg-01",
    labId: "lab-pune-cnc-01",
    labName: "5-Axis CNC Precision Machining Center",
    instituteId: "inst-iti-aundh-pune",
    equipmentName: "DMG MORI 5-Axis Universal Machining Center (Simultaneous Multi-Axis)",
    category: "Precision Manufacturing",
    totalQuantity: 2,
    operationalQuantity: 2,
    maintenanceStatus: "OPERATIONAL",
    readinessStatus: "READY",
    ageYears: 2.1,
    supportedSkills: ["5-Axis CNC Precision Machining"],
    supportedCourses: ["course-5axis-cnc-01"],
  },
  {
    id: "eq-canoe-bus-01",
    labId: "lab-bengaluru-edge-01",
    labName: "Industrial IoT & Edge AI Prototyping Bay",
    instituteId: "inst-polytechnic-bengaluru",
    equipmentName: "Vector CANoe / VN1630A Automotive Bus Interface & Test Bench",
    category: "Hardware-in-the-Loop",
    totalQuantity: 10,
    operationalQuantity: 9,
    maintenanceStatus: "OPERATIONAL",
    readinessStatus: "READY",
    ageYears: 1.5,
    supportedSkills: ["CAN Bus Communication", "Edge AI & Embedded Firmware"],
    supportedCourses: ["course-edge-ai-01"],
  },
];

export const labEquipmentService = {
  async getAllLabs(params?: { instituteId?: string }): Promise<LabDetail[]> {
    let list = [...CANONICAL_LABS];
    if (params?.instituteId) {
      list = list.filter((l) => l.instituteId === params.instituteId);
    }
    return list;
  },

  async getAllEquipment(params?: { labId?: string; instituteId?: string }): Promise<EquipmentDetail[]> {
    let list = [...CANONICAL_EQUIPMENT_DETAILS];
    if (params?.labId) {
      list = list.filter((e) => e.labId === params.labId);
    }
    if (params?.instituteId) {
      list = list.filter((e) => e.instituteId === params.instituteId);
    }
    return list;
  },

  async simulateEquipmentFailure(equipmentId: string): Promise<EquipmentFailureSimulationResult> {
    const eq = CANONICAL_EQUIPMENT_DETAILS.find((e) => e.id === equipmentId) || CANONICAL_EQUIPMENT_DETAILS[0];

    return {
      label: "SIMULATION",
      disclaimer: "THIS IS AN EQUIPMENT FAILURE IMPACT SIMULATION FOR PREVENTIVE MAINTENANCE GOVERNANCE.",
      equipmentId: eq.id,
      equipmentName: eq.equipmentName,
      labName: eq.labName,
      affectedCourses: eq.supportedCourses,
      affectedSeats: 48,
      affectedStudentsCount: 48,
      affectedSkills: eq.supportedSkills,
      potentialPlacementImpactPercentage: -24,
      estimatedRepairCostINR: 150000,
      recommendedPreventiveAction: "Schedule mandatory bi-annual OEM calibration contract with Tata Motors / Vector Tech.",
      generatedAt: new Date().toISOString(),
    };
  },
};
