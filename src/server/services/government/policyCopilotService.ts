// ==============================================================================
// CAREERIS POLICY COPILOT SERVICE
// Grounded AI Policy Assistant for Public Decision-Makers & Skill Planners
// ==============================================================================

import {
  AIPolicyCopilotQuery,
  AIPolicyCopilotResponse,
  IPolicyAIProvider,
} from "@/types/governmentIntelligence";
import { districtRiskRepository } from "@/server/repositories/districtRiskRepository";
import { governmentProgramRepository } from "@/server/repositories/governmentProgramRepository";
import { policyScenarioRepository } from "@/server/repositories/policyScenarioRepository";

export class DeterministicPolicyAIProvider implements IPolicyAIProvider {
  async askCopilot(query: AIPolicyCopilotQuery): Promise<AIPolicyCopilotResponse> {
    const q = query.query.toLowerCase();

    // 1. "What are the largest skill shortages?"
    if (q.includes("shortage") || q.includes("largest") || q.includes("deficit") || q.includes("hardest")) {
      return {
        answer: `Nationally, **Battery Management Systems (BMS)** is currently India's most acute industrial skill deficit with a **4.6x Demand/Supply gap** (Annual Demand: 38,000 vs Verified Supply: 8,200), followed closely by **5-Axis CNC Precision Machining** (2.4x gap, 65,000 openings) and **Edge AI Embedded Firmware** (3.2x gap, 42,000 openings).\n\nThe deficit is concentrated in the Chakan-Talegaon (MH), Peenya (KA), and Oragadam (TN) manufacturing corridors.`,
        groundingLabel: "FACT",
        groundingData: {
          skillsReferenced: ["Battery Management Systems (BMS)", "5-Axis CNC Machining", "Edge AI"],
          statesReferenced: ["Maharashtra", "Karnataka", "Tamil Nadu"],
          sourcesUsed: ["CareerIS Labour Demand Engine", "National Skill Registry", "MCA21 Ingestion"],
        },
        suggestedFollowUpActions: [
          { title: "Inspect Skill Priority Matrix", actionUrl: "/government/skills" },
          { title: "View District Priority Map", actionUrl: "/government/india" },
        ],
        policyOptions: [
          "Sanction ₹35 Cr capital grant for ITI CoE high-voltage test benches under NAPS.",
          "Expand STRIVE World Bank lab modernization across 120 industrial ITIs.",
        ],
      };
    }

    // 2. "Which districts need intervention?"
    if (q.includes("district") || q.includes("intervention") || q.includes("priority") || q.includes("where")) {
      const priorities = await districtRiskRepository.findAllPriorities();
      const top = priorities[0];

      return {
        answer: `Based on CareerIS multi-factor priority scoring, **Pune District (Score: 89/100, CRITICAL)** requires the highest immediate intervention priority, followed by **Bengaluru Urban (82/100, HIGH)** and **Chennai (78/100, HIGH)**.\n\nPune's score is driven by a 4.6x BMS shortage and 62% under-capacity in certified high-voltage lab facilities.`,
        groundingLabel: "ANALYSIS",
        groundingData: {
          districtsReferenced: ["Pune", "Bengaluru Urban", "Chennai", "Ahmedabad"],
          sourcesUsed: ["District Priority Engine", "DVET Maharashtra", "TNSDC Filings"],
        },
        suggestedFollowUpActions: [
          { title: "Open Pune District Action Center", actionUrl: "/government/districts/dist-pune" },
          { title: "View Active Interventions", actionUrl: "/government/interventions" },
        ],
        policyOptions: [
          "Authorize 240-seat sponsored CoE partnership at ITI Aundh.",
          "Authorize instructor retraining in CAM multi-axis tool design.",
        ],
      };
    }

    // 3. "What happens if we add seats / simulate?"
    if (q.includes("simulate") || q.includes("what happens") || q.includes("seats") || q.includes("add")) {
      const scenarios = await policyScenarioRepository.findAll();
      const scen = scenarios[0];

      return {
        answer: `**Simulation Result (SIMULATION)**: Adding **+30% training seat capacity** in Pune BMS trades is projected to:\n\n- Add **+560 verified technicians annually** (increasing output from 980 to 1,540).\n- Reduce regional net deficit from 3,520 to 2,960 openings (16% gap closure).\n- Lift placement rate from 74% to 86%.\n- Estimated cost: **₹17,850 per additional placed technician**.\n\n*Note: Pairing this with an OEM Apprenticeship (Scenario B) boosts placement to 94% with 40% industry cost-sharing.*`,
        groundingLabel: "SIMULATION",
        groundingData: {
          skillsReferenced: ["Battery Management Systems (BMS)"],
          districtsReferenced: ["Pune"],
          sourcesUsed: ["CareerIS What-If Scenario Engine", "DVET Elasticity Model"],
        },
        suggestedFollowUpActions: [
          { title: "Compare Scenarios", actionUrl: "/government/scenarios" },
          { title: "Propose Intervention", actionUrl: "/government/interventions" },
        ],
      };
    }

    // 4. "Which programs produce the strongest outcomes / ROI?"
    if (q.includes("program") || q.includes("scheme") || q.includes("outcome") || q.includes("roi") || q.includes("cost")) {
      return {
        answer: `**National Apprenticeship Promotion Scheme (NAPS Dual-VET)** delivers the strongest outcome performance with a **78.4% placement rate** and the lowest cost per placement (**₹14,200/placement**), compared to PMKVY 4.0 (64.2% placement, ₹18,500/placement) and State Skill Missions (₹21,000/placement).\n\nThe superior ROI stems from direct on-the-job training and mandatory industry stipend co-funding.`,
        groundingLabel: "FACT",
        groundingData: {
          programsReferenced: ["NAPS Dual-VET", "PMKVY 4.0", "STRIVE"],
          sourcesUsed: ["Public Financial Management System (PFMS)", "National Skill Registry"],
        },
        suggestedFollowUpActions: [
          { title: "View Program KPIs", actionUrl: "/government/programs" },
          { title: "Budget & Outcome Governance", actionUrl: "/government/budget" },
        ],
      };
    }

    // 5. Default National Overview
    const programs = await governmentProgramRepository.findAll();
    return {
      answer: `I am monitoring **${programs.length} pan-India skill programs** across **28 States and 8 UTs** representing **24.5 Lakh active employer vacancies** and **₹718 Cr in audited public skill investments**.\n\nKey policy attention is currently required in the Chakan and Peenya industrial corridors for EV and Industrial IoT lab upgrades.`,
      groundingLabel: "FACT",
      groundingData: {
        sourcesUsed: ["Government Command Center Engine", "National Skill Registry"],
      },
      suggestedFollowUpActions: [
        { title: "Command Center Overview", actionUrl: "/government" },
        { title: "Pan-India Map", actionUrl: "/government/india" },
      ],
    };
  }
}

let activePolicyProvider: IPolicyAIProvider = new DeterministicPolicyAIProvider();

export const policyCopilotService = {
  setProvider(provider: IPolicyAIProvider) {
    activePolicyProvider = provider;
  },

  async ask(query: AIPolicyCopilotQuery): Promise<AIPolicyCopilotResponse> {
    return activePolicyProvider.askCopilot(query);
  },
};
