// ==============================================================================
// CAREERIS TRAINING COPILOT SERVICE
// Grounded AI Training Decision Copilot for ITI Principals & Instructors
// ==============================================================================

import {
  AITrainingCopilotQuery,
  AITrainingCopilotResponse,
  ITrainingAIProvider,
} from "@/types/trainingEcosystem";
import { trainingInstituteRepository } from "@/server/repositories/trainingInstituteRepository";
import { courseHealthIntelligenceService } from "@/server/services/training/courseHealthIntelligenceService";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";

export class DeterministicTrainingAIProvider implements ITrainingAIProvider {
  async askCopilot(query: AITrainingCopilotQuery): Promise<AITrainingCopilotResponse> {
    const q = query.query.toLowerCase();

    // 1. "Which courses should we expand?"
    if (q.includes("expand") || q.includes("highest demand") || q.includes("add seats")) {
      return {
        answer: `Based on CareerIS Market Fit scoring and regional employer requisitions:\n\n1. **High-Voltage BMS Specialist (Fit Score: 94/100, EXPAND)**: 4.6x regional deficit; +35% seat expansion recommended with 92% placement probability.\n2. **5-Axis CNC Precision Machining (Fit Score: 91/100, EXPAND)**: 2.4x demand ratio across auto and aerospace tooling.\n3. **Industrial IoT & Edge AI Diploma (Fit Score: 88/100, EXPAND)**: 5,800 open requisitions across Peenya & Whitefield corridors.`,
        groundingLabel: "RECOMMENDATION",
        groundingData: {
          coursesReferenced: ["High-Voltage BMS Specialist", "5-Axis CNC Precision Machining", "Edge AI Diploma"],
          sourcesUsed: ["CareerIS Course Market Fit Engine", "Enterprise Requisition Registry"],
        },
        suggestedFollowUpActions: [
          { title: "Run Capacity Expansion Scenario", actionUrl: "/training/capacity" },
          { title: "View Course Health Radar", actionUrl: "/training/courses" },
        ],
        actionOptions: [
          "Sanction second shift batches at ITI Aundh.",
          "Partner with Tata Motors under NAPS Dual-Vocational apprenticeship.",
        ],
      };
    }

    // 2. "Which course is becoming obsolete?"
    if (q.includes("obsolete") || q.includes("retire") || q.includes("low placement") || q.includes("legacy")) {
      return {
        answer: `**General Manual Metal Arc Welder (course-legacy-welder-01)** is flagged as **CRITICAL_UPDATE_REQUIRED (Health Score: 42/100)**.\n\n- **Signals**: Placement rate dropped to 38% while local OEM plants transitioned 92% of spot welding to 6-Axis FANUC & KUKA robotic cells.\n- **Recommendation**: **MODERNIZE (Do not retire)**. Upgrade 60% of syllabus into Robotic Spot Welding and fiber laser welding.`,
        groundingLabel: "ANALYSIS",
        groundingData: {
          coursesReferenced: ["General Manual Metal Arc Welder"],
          sourcesUsed: ["CareerIS Obsolescence Engine", "ASDC Sector Skill Advisory"],
        },
        suggestedFollowUpActions: [
          { title: "Inspect Curriculum Gap", actionUrl: "/training/curriculum" },
          { title: "View Trainer Retraining Pathways", actionUrl: "/training/trainers" },
        ],
      };
    }

    // 3. "Which trainers need retraining?"
    if (q.includes("trainer") || q.includes("instructor") || q.includes("retrain")) {
      return {
        answer: `Currently, **Mahesh Patil (ITI Aundh)** and **42 regional welding instructors** require competency retraining:\n\n- **Current Competency**: Manual Shielded Metal Arc Welding.\n- **Target Competency**: Robotic Cell Kinematics & Spot Welding (ASDC Level 6).\n- **Recommended Pathway**: TNSDC / DVET 4-week Industry 4.0 Master Trainer Cohort.`,
        groundingLabel: "FACT",
        groundingData: {
          trainersReferenced: ["Mahesh Patil", "42 Regional Instructors"],
          sourcesUsed: ["Trainer Competency Registry", "DVET Faculty Database"],
        },
        suggestedFollowUpActions: [
          { title: "Open Trainer Retraining Dossier", actionUrl: "/training/trainers" },
        ],
      };
    }

    // 4. "What happens if equipment fails / simulator?"
    if (q.includes("equipment") || q.includes("fail") || q.includes("maintenance") || q.includes("simulate")) {
      return {
        answer: `**Simulation Result (SIMULATION)**: If the **High-Voltage Battery Testing Station** at ITI Aundh undergoes un-serviced breakdown:\n\n- **Impact**: 48 active students in 2 batches lose practical diagnostic bench access.\n- **Placement Impact**: Projected -24% drop in 6-month placement conversion.\n- **Preventive Action**: Maintain active OEM AMC contract (Est. cost: ₹1.5L/year).`,
        groundingLabel: "SIMULATION",
        groundingData: {
          labsReferenced: ["Advanced EV Powertrain & Battery Testing Lab"],
          sourcesUsed: ["CareerIS Equipment Impact Simulator", "DVET Maintenance Guidelines"],
        },
        suggestedFollowUpActions: [
          { title: "Review Lab Equipment Inventory", actionUrl: "/training/labs" },
        ],
      };
    }

    // Default Overview
    return {
      answer: `I am connected to **5 pan-India Centers of Excellence & ITIs**, monitoring **82 vocational courses**, **185 trainers**, and **₹62 Cr in technical training capacity**.\n\nHow can I assist your institute operations today?`,
      groundingLabel: "FACT",
      groundingData: {
        sourcesUsed: ["CareerIS Training Ecosystem Engine"],
      },
      suggestedFollowUpActions: [
        { title: "Which courses should we expand?", actionUrl: "" },
        { title: "Which course is becoming obsolete?", actionUrl: "" },
      ],
    };
  }
}

let activeTrainingProvider: ITrainingAIProvider = new DeterministicTrainingAIProvider();

export const trainingCopilotService = {
  setProvider(provider: ITrainingAIProvider) {
    activeTrainingProvider = provider;
  },

  async ask(query: AITrainingCopilotQuery): Promise<AITrainingCopilotResponse> {
    return activeTrainingProvider.askCopilot(query);
  },
};
