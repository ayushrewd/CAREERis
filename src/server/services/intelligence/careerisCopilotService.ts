// ==============================================================================
// CAREERIS INTELLIGENCE COPILOT SERVICE
// Role-Aware Grounded National AI Assistant with Structured Multi-Factor Responses
// ==============================================================================

import {
  CareerISCopilotQuery,
  CareerISCopilotStructuredResponse,
  ICareerISCopilotProvider,
} from "@/types/predictiveIntelligence";

export class DeterministicCareerISCopilotProvider implements ICareerISCopilotProvider {
  async ask(query: CareerISCopilotQuery): Promise<CareerISCopilotStructuredResponse> {
    const q = query.query.toLowerCase();

    // 1. "What skills are growing fastest?"
    if (q.includes("fastest") || q.includes("growing") || q.includes("highest growth") || q.includes("emerging")) {
      return {
        answer: "The 3 fastest growing vocational skills across India are **Battery Management Systems (BMS, +170.4% YoY)**, **5-Axis CNC Precision Machining (+117.5% YoY)**, and **Edge AI Embedded Firmware (+85.2% YoY)**.",
        why: [
          "Electric Vehicle (EV) gigafactory expansions in Maharashtra, Tamil Nadu, and Gujarat.",
          "Aerospace & precision tooling modernization displacing 3-axis legacy machines.",
          "Industrial IoT smart factory automation in Bengaluru and Hyderabad corridors.",
        ],
        evidence: [
          { dataset: "CareerIS National Labour Demand Registry", date: "2026-02", geography: "Pan-India", metric: "YoY Requisition Velocity", confidence: 0.96 },
          { dataset: "ASDC Sector Skill Council Filings", date: "2026-01", geography: "Auto Hubs", metric: "Hiring Deficit Ratio (4.6x)", confidence: 0.95 },
        ],
        whatItMeans: "Vocational candidates with certified BMS or 5-Axis CNC credentials experience 2.4x higher interview offer rates with entry salary premiums of +35% to +45%.",
        recommendedAction: "Prioritize enrollment in NCVT/DGT accredited CoE programs and complete Skill Passport verification.",
        confidenceScore: 0.95,
        classification: "FORECAST",
        limitations: [
          "Rapid battery chemistry shifts could introduce new solid-state diagnostic standards by 2027.",
        ],
        suggestedFollowUps: [
          "Which districts have the largest future skill gaps?",
          "Which courses should be modernized?",
        ],
      };
    }

    // 2. "Which districts have the largest future skill gaps?"
    if (q.includes("district") || q.includes("largest gap") || q.includes("shortage zone")) {
      return {
        answer: "The top 3 districts facing the largest projected 12-month skill deficits are **Pune (Maharashtra, -31,500 deficit in BMS/EV)**, **Bengaluru Urban (Karnataka, -14,000 deficit in 5-Axis CNC/Edge AI)**, and **Chennai (Tamil Nadu, -18,200 deficit in Robotic Spot Welding)**.",
        why: [
          "Heavy concentration of tier-1 manufacturing hubs outpacing regional ITI seat capacities.",
          "Relocation friction for rural candidates from adjacent districts.",
        ],
        evidence: [
          { dataset: "District Labour-Market Gap Matrix", date: "2026-02", geography: "Pune / Bengaluru / Chennai", metric: "Net Projected Deficit", confidence: 0.94 },
        ],
        whatItMeans: "Regional employers face hiring delays extending from 4 weeks to 10 weeks unless seat capacities and Dual-VET apprenticeships expand.",
        recommendedAction: "Deploy Targeted District Skill Interventions under STRIVE / State Skill Missions.",
        confidenceScore: 0.94,
        classification: "INFERENCE",
        limitations: [
          "District-level data relies on registered enterprise requisitions and active ITI batch counts.",
        ],
        suggestedFollowUps: [
          "Where should government increase training seats?",
          "What happens if training capacity increases by 25%?",
        ],
      };
    }

    // 3. "Which courses should be modernized?" / "Which skills are becoming less relevant?"
    if (q.includes("modernize") || q.includes("obsolete") || q.includes("less relevant") || q.includes("legacy")) {
      return {
        answer: "**General Manual Metal Arc Welder (Health Score: 32/100, CRITICAL_UPDATE)** and **Manual Mechanical Draughtsmanship (Health Score: 28/100)** require urgent modernization into **Robotic Cell Spot Welding** and **3D CAD/CAM Metrology**.",
        why: [
          "Manual welding job listings dropped -62% YoY as automotive body shops automated 92% of lines.",
          "Placement conversions for manual welding trades fell below 38% in auto corridors.",
        ],
        evidence: [
          { dataset: "CareerIS Course Health & Obsolescence Engine", date: "2026-02", geography: "Pan-India", metric: "Course Health Index", confidence: 0.97 },
        ],
        whatItMeans: "Institutes must NOT shut trades down; rather, they should modernize 60% of curriculum and retrain instructors into 6-Axis robotics.",
        recommendedAction: "Sponsor manual welding instructors for 4-week ASDC Robotic Welding Master Trainer cohorts.",
        confidenceScore: 0.96,
        classification: "RECOMMENDATION",
        limitations: [
          "Infrastructure modernization requires capital outlay for robotic training rigs (Est. ₹14L/ITI).",
        ],
        suggestedFollowUps: [
          "Which trainer competencies will become important?",
          "What happens if training capacity increases by 25%?",
        ],
      };
    }

    // 4. "What happens if training capacity increases by 25%?"
    if (q.includes("25%") || q.includes("scenario") || q.includes("simulate") || q.includes("what happens")) {
      return {
        answer: "**Simulation Result (SIMULATION ONLY)**: Increasing technical training capacity by **+25%** in Pune EV Hub adds **+300 sanctioned seats**, producing **+222 additional placed graduates annually** with an estimated capex requirement of **₹84 Lakhs**.",
        why: [
          "88% average completion rate and 84% placement conversion modeled across ASDC certified cohorts.",
        ],
        evidence: [
          { dataset: "CareerIS Policy What-If Scenario Simulator", date: "2026-02", geography: "Pune EV Corridor", metric: "Elasticity Model Projection", confidence: 0.92 },
        ],
        whatItMeans: "Closes the regional BMS technician deficit from 31,500 to 28,400 within the first academic cycle.",
        recommendedAction: "Approve blended state-industry co-funding model with Tata Motors under NAPS Dual-VET.",
        confidenceScore: 0.92,
        classification: "SIMULATION",
        limitations: [
          "Simulation assumes constant enterprise hiring appetite and 1:24 faculty-to-student ratio.",
        ],
        suggestedFollowUps: [
          "Which districts have the largest future skill gaps?",
        ],
      };
    }

    // Default Overview
    return {
      answer: `I am connected to the **CareerIS National Predictive Intelligence Engine**, tracking **24.5 Lakh live requisitions**, **3M–36M multi-horizon forecasts**, and **51 validated machine learning models** across India.\n\nHow can I provide foresight for your operations today?`,
      why: ["Pan-India live synchronization with enterprise requisitions, NCVT registries, and economic indicators."],
      evidence: [
        { dataset: "CareerIS Central Predictive Knowledge Graph", date: "2026-02", geography: "Pan-India", metric: "28 States & 8 UTs Coverage", confidence: 0.95 },
      ],
      whatItMeans: "You have real-time access to empirical labour forecasts, career trajectories, and policy simulation models.",
      recommendedAction: "Select a suggested question or enter your strategic inquiry below.",
      confidenceScore: 0.95,
      classification: "FACT",
      limitations: ["Predictive models are updated weekly; all policy interventions require human sign-off."],
      suggestedFollowUps: [
        "What skills are growing fastest?",
        "Which districts have the largest future skill gaps?",
        "Which courses should be modernized?",
      ],
    };
  }
}

let activeCopilotProvider: ICareerISCopilotProvider = new DeterministicCareerISCopilotProvider();

export const careerisCopilotService = {
  setProvider(provider: ICareerISCopilotProvider) {
    activeCopilotProvider = provider;
  },

  async ask(query: CareerISCopilotQuery): Promise<CareerISCopilotStructuredResponse> {
    return activeCopilotProvider.ask(query);
  },
};
