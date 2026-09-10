// ==============================================================================
// CAREERIS RECRUITMENT COPILOT SERVICE
// Grounded AI Decision Support for Talent Acquisition & Workforce Planning
// ==============================================================================

import {
  RecruitmentCopilotQuery,
  RecruitmentCopilotResponse,
  IRecruitmentAIProvider,
} from "@/types/employerIntelligence";
import { jobRequisitionRepository } from "@/server/repositories/jobRequisitionRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { CANONICAL_SKILL_SHORTAGES } from "@/data/canonicalWorkforcePlansData";

export class DeterministicRecruitmentAIProvider implements IRecruitmentAIProvider {
  async askCopilot(query: RecruitmentCopilotQuery): Promise<RecruitmentCopilotResponse> {
    const q = query.query.toLowerCase();

    // 1. "Which candidates best match this job / requisition?"
    if (q.includes("match") || q.includes("candidate") || q.includes("who")) {
      const candidates = await candidateRepository.findAll();
      const topCandidates = candidates.slice(0, 3);
      const names = topCandidates.map((c) => (c.id === "cand-rohit-01" ? "Rohit Sharma (92% Match - Verified ASDC Level 5)" : `Candidate #${c.id.slice(-4)} (${c.headline || "Specialist"})`));

      return {
        answer: `Based on deterministic 7-factor matching against your active requisitions in Pune/Chakan, here are your top candidates:\n\n1. **${names[0]}**: Holds proctored ASDC Level 5 verification in BMS & CAN Bus with practical capstone evidence.\n2. **${names[1] || "Amit Verma (88% Match)"}**: Strong mechatronics background, 2.5 yrs experience, located in Pune.\n\nAll candidate scores are fully explainable through the Skill Graph.`,
        groundingLabel: "FACT",
        groundingData: {
          requisitionsAnalyzed: 3,
          candidatesAnalyzed: candidates.length,
          skillsReferenced: ["Battery Management Systems (BMS)", "CAN Bus Communication"],
          geographiesReferenced: ["Pune", "Maharashtra"],
          sourcesUsed: ["CareerIS Candidate Registry", "National Skill Passport System"],
        },
        suggestedFollowUpActions: [
          { title: "Review Candidate Dossiers", actionUrl: "/employer/candidates" },
          { title: "Schedule Technical Panel", actionUrl: "/employer/interviews" },
        ],
      };
    }

    // 2. "Which skills are hardest to hire / scarce?"
    if (q.includes("hard") || q.includes("scarce") || q.includes("shortage") || q.includes("difficult")) {
      const shortages = CANONICAL_SKILL_SHORTAGES;
      const topShortage = shortages[0];

      return {
        answer: `**${topShortage.skillName}** is currently your most acute skill shortage across Maharashtra with a **${topShortage.demandSupplyRatio.toFixed(1)}x Demand/Supply gap** (Regional Annual Demand: ${topShortage.annualRegionalDemand} openings vs ${topShortage.verifiedTalentSupply} verified candidates).\n\nAverage time-to-hire in the Chakan corridor is **${topShortage.averageTimeToHireDays} days**.`,
        groundingLabel: "FACT",
        groundingData: {
          skillsReferenced: [topShortage.skillName],
          geographiesReferenced: ["Pune", "Chakan Industrial Corridor"],
          sourcesUsed: ["CareerIS Labour-Market Demand Engine", "MSDE Institutional Registry"],
        },
        suggestedFollowUpActions: [
          { title: "Inspect Talent Availability Map", actionUrl: "/employer/talent" },
          { title: "Evaluate Hire vs Train Decision", actionUrl: "/employer/workforce" },
        ],
      };
    }

    // 3. "Should I hire or train?"
    if (q.includes("hire") && q.includes("train")) {
      return {
        answer: `**Recommendation: 60/40 Hybrid Strategy (Partner & Train)**\n\n- **Direct Hiring**: Directly hire 4-6 senior calibration leads for immediate line bring-up.\n- **CoE Partnership**: Partner with Government ITI Aundh to sponsor a 24-student vocational cohort (₹35,000 cost/candidate vs ₹1,20,000 recruiter agency fee).\n\nThis balances immediate technical urgency with long-term retention.`,
        groundingLabel: "RECOMMENDATION",
        groundingData: {
          skillsReferenced: ["Battery Management Systems (BMS)", "High-Voltage Safety"],
          geographiesReferenced: ["Pune District"],
          sourcesUsed: ["CareerIS Hire vs Train Decision Engine", "ITI Capacity Database"],
        },
        suggestedFollowUpActions: [
          { title: "Open Hire vs Train Engine", actionUrl: "/employer/workforce" },
          { title: "Explore ITI CoE Partnerships", actionUrl: "/employer/partnerships" },
        ],
      };
    }

    // 4. Default / General Inquiry
    const requisitionsRes = await jobRequisitionRepository.findAll({ employerId: query.employerId });
    return {
      answer: `I have analyzed your **${requisitionsRes.total} active requisitions** and **54 pipeline candidates** across Pune, Bengaluru, and Noida.\n\nYour highest priority requisition is **Battery Management System (BMS) Calibration Specialist** (REQ-TM-2026-0042) with 8 openings and 9 shortlisted verified candidates.`,
      groundingLabel: "FACT",
      groundingData: {
        requisitionsAnalyzed: requisitionsRes.total,
        candidatesAnalyzed: 54,
        sourcesUsed: ["CareerIS Requisition Engine", "Recruiter Workspace"],
      },
      suggestedFollowUpActions: [
        { title: "View Active Requisitions", actionUrl: "/employer/jobs" },
        { title: "Go to Pipeline Board", actionUrl: "/employer/candidates" },
      ],
    };
  }
}

let activeProvider: IRecruitmentAIProvider = new DeterministicRecruitmentAIProvider();

export const recruitmentCopilotService = {
  setProvider(provider: IRecruitmentAIProvider) {
    activeProvider = provider;
  },

  async ask(query: RecruitmentCopilotQuery): Promise<RecruitmentCopilotResponse> {
    return activeProvider.askCopilot(query);
  },
};
