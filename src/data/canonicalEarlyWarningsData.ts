// ==============================================================================
// CAREERIS CANONICAL PREDICTIVE EARLY WARNINGS DATA
// Early Warning Alerts & Evidence-Grounded Signal Fusion Records
// ==============================================================================

import { PredictiveEarlyWarningAlert } from "@/types/predictiveIntelligence";

export const CANONICAL_PREDICTIVE_ALERTS: PredictiveEarlyWarningAlert[] = [
  {
    alertId: "alert-pred-01",
    trigger: "Severe Battery Management Systems (BMS) Talent Scarcity Acceleration",
    severity: "CRITICAL",
    signalFusionStatus: "CONSISTENT",
    affectedGeography: "Pune & Chakan Industrial Corridor (Maharashtra)",
    affectedSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Norms"],
    affectedRoles: ["EV Powertrain Calibration Specialist"],
    evidenceData: "4.6x demand-to-supply ratio; 3,800 open requisitions vs 480 regional ITI graduates in 2026.",
    recommendedIntervention: "Increase sanctioned BMS vocational seats by +35% across ITI Aundh and Polytechnic Pune.",
    confidenceScore: 0.96,
    detectedAt: "2026-02-18T08:00:00Z",
  },
  {
    alertId: "alert-pred-02",
    trigger: "Structural Demand Collapse in Legacy Manual Shielded Arc Welding",
    severity: "HIGH",
    signalFusionStatus: "CONSISTENT",
    affectedGeography: "Oragadam-Sriperumbudur Auto Hub (Tamil Nadu)",
    affectedSkills: ["Manual Shielded Metal Arc Welding"],
    affectedRoles: ["Manual Arc Welder"],
    evidenceData: "Hiring requisitions down -62% YoY as tier-1 supplier plants automated 92% of welding lines.",
    recommendedIntervention: "Initiate mandatory curriculum modernization into 6-Axis Robotic Cell Spot Welding.",
    confidenceScore: 0.94,
    detectedAt: "2026-02-15T14:30:00Z",
  },
  {
    alertId: "alert-pred-03",
    trigger: "Edge AI & Embedded Firmware Diffusion Across Industrial IoT",
    severity: "MEDIUM",
    signalFusionStatus: "CONSISTENT",
    affectedGeography: "Peenya Industrial Area (Bengaluru, Karnataka)",
    affectedSkills: ["Edge AI & Embedded Firmware", "Automotive RTOS"],
    affectedRoles: ["Industrial IoT Firmware Engineer"],
    evidenceData: "Cross-industry hiring diffusion increased by +54% in smart factory automation lines.",
    recommendedIntervention: "Install Vector CANoe test benches at Government Polytechnic Bengaluru.",
    confidenceScore: 0.92,
    detectedAt: "2026-02-12T11:00:00Z",
  },
];
