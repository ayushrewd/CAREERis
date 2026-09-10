// ==============================================================================
// CAREERIS POLICY RECOMMENDATION REPOSITORY
// Evidence-Grounded Policy Priorities & Human-in-the-Loop Actions
// ==============================================================================

import { PolicyRecommendation } from "@/types/governmentIntelligence";

let inMemoryRecommendations: PolicyRecommendation[] = [
  {
    id: "rec-pune-bms-coe",
    title: "Sanction 240-Seat Sponsored CoE Apprenticeship Corridor with Chakan OEMs",
    problem: "Acute 4.6x shortage of certified BMS calibration and high-voltage safety technicians in Pune auto cluster.",
    evidence: [
      "CareerIS Labour Market Engine reported 4,500 annual vacancies with 48 days avg time-to-fill.",
      "78% of local ITI mechanical graduates fail high-voltage safety test bench benchmarks.",
    ],
    rootSignal: "EV line conversions in Chakan Phase 2 outpace traditional ITI electrical trade syllabi.",
    geographyScope: "DISTRICT",
    targetStateCode: "MH",
    targetDistrictName: "Pune",
    targetSkills: ["Battery Management Systems (BMS)", "High-Voltage Safety Norms"],
    affectedPopulation: 4500,
    options: [
      {
        optionName: "Option A: 60/40 Government-Industry Sponsored CoE (Recommended)",
        description: "DVET sanctions ₹3.5 Cr capital grant, while Tata Motors EV Division provides hardware test benches and guaranteed apprenticeships.",
        estimatedCostINR: 35000000,
        expectedImpact: "Closes 24% of annual deficit within 12 months with 92% placement rate.",
        risk: "LOW",
      },
      {
        optionName: "Option B: State-Funded ITI Lab Modernization only",
        description: "100% state funded without direct OEM hiring commitment.",
        estimatedCostINR: 42000000,
        expectedImpact: "Closes 15% of annual deficit; placement depends on open market hiring.",
        risk: "MEDIUM",
      },
    ],
    recommendedAction: "Authorize Option A under NAPS Dual-Vocational apprenticeship guidelines.",
    expectedOutcome: "Produce 300 certified BMS technicians annually with ₹4.5 LPA median entry wage.",
    confidenceScore: 0.95,
    sources: ["DVET Maharashtra Filings", "Chakan Industrial Association Survey", "ASDC Sector Skill Council"],
    requiresHumanApproval: true,
    generatedAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "rec-bengaluru-edge-ai",
    title: "Modernize Peenya Polytechnic Labs with Edge AI & Vector CAN Benches",
    problem: "3.2x deficit in Industrial IoT & Edge AI firmware engineers in Bengaluru Urban.",
    evidence: [
      "5,800 open requisitions across Peenya and Whitefield tech hardware parks.",
      "Current polytechnic curriculum lacks RTOS and CAN Bus DBC practical tools.",
    ],
    rootSignal: "Smart factory conversions and automotive ECU manufacturing expansion.",
    geographyScope: "DISTRICT",
    targetStateCode: "KA",
    targetDistrictName: "Bengaluru Urban",
    targetSkills: ["Edge AI & Embedded Firmware", "CAN Bus Communication"],
    affectedPopulation: 5800,
    options: [
      {
        optionName: "Option A: KSDC Capital Equipment Grant (Recommended)",
        description: "Install 40 modern embedded stations at Government Polytechnic Bengaluru.",
        estimatedCostINR: 28000000,
        expectedImpact: "Add 200 certified engineers annually.",
        risk: "LOW",
      },
    ],
    recommendedAction: "Release ₹2.8 Cr from Nava Karnataka High-Tech Fund.",
    expectedOutcome: "200 graduates annually with ₹6.8 LPA average placement CTC.",
    confidenceScore: 0.92,
    sources: ["KSDC Tech Cluster Survey", "NASSCOM FutureSkills"],
    requiresHumanApproval: true,
    generatedAt: "2026-02-22T11:30:00Z",
  },
];

export const policyRecommendationRepository = {
  async findAll(params?: { stateCode?: string; districtName?: string }): Promise<PolicyRecommendation[]> {
    let list = [...inMemoryRecommendations];
    if (params?.stateCode) {
      list = list.filter((r) => r.targetStateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtName) {
      list = list.filter((r) => r.targetDistrictName?.toLowerCase() === params.districtName!.toLowerCase());
    }
    return list;
  },

  async findById(id: string): Promise<PolicyRecommendation | null> {
    const found = inMemoryRecommendations.find((r) => r.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
};
