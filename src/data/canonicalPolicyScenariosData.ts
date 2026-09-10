// ==============================================================================
// CAREERIS CANONICAL POLICY SCENARIOS DATA
// What-If Simulations Grounded in Elasticity Models (Mandatory SIMULATION Labeling)
// ==============================================================================

import { PolicyScenarioComparisonResult } from "@/types/governmentIntelligence";

export const CANONICAL_POLICY_SCENARIOS: PolicyScenarioComparisonResult[] = [
  {
    label: "SIMULATION",
    disclaimer: "THIS IS A POLICY SCENARIO SIMULATION GROUNDED IN HISTORICAL SUPPLY/DEMAND ELASTICITY. NOT AN ACTUAL GUARANTEED OUTCOME.",
    scenarioId: "scen-pune-bms-expand",
    scenarioTitle: "Scenario A: +30% High-Voltage BMS Seat Expansion at ITI Aundh",
    baseline: {
      demand: 4500,
      supply: 980,
      netGap: 3520,
      placementRate: 74,
      estimatedBudgetINR: 25000000,
    },
    projected: {
      demand: 4500,
      supply: 1540,
      netGap: 2960,
      placementRate: 86,
      estimatedBudgetINR: 35000000,
    },
    impactSummary: "Reduces acute Pune BMS deficit by 560 verified technicians annually and boosts high-voltage placement rate from 74% to 86%.",
    roiAssessment: "Estimated ₹17,850 cost per additional placed technician vs ₹1,20,000 employer recruiter agency hiring cost.",
    confidence: 0.93,
    generatedAt: "2026-02-25T10:00:00Z",
  },
  {
    label: "SIMULATION",
    disclaimer: "THIS IS A POLICY SCENARIO SIMULATION GROUNDED IN HISTORICAL SUPPLY/DEMAND ELASTICITY. NOT AN ACTUAL GUARANTEED OUTCOME.",
    scenarioId: "scen-pune-hybrid-coe",
    scenarioTitle: "Scenario B: +30% Seats + Tata Motors CoE Apprenticeship Partnership",
    baseline: {
      demand: 4500,
      supply: 980,
      netGap: 3520,
      placementRate: 74,
      estimatedBudgetINR: 25000000,
    },
    projected: {
      demand: 4500,
      supply: 1820,
      netGap: 2680,
      placementRate: 94,
      estimatedBudgetINR: 42000000,
    },
    impactSummary: "Maximized impact: Closes 24% of regional deficit in 12 months with 94% guaranteed placement in Chakan auto hub.",
    roiAssessment: "Cost per placed graduate drops to ₹14,200 with 40% industry equipment cost-share under CSR.",
    confidence: 0.96,
    generatedAt: "2026-02-25T10:00:00Z",
  },
  {
    label: "SIMULATION",
    disclaimer: "THIS IS A POLICY SCENARIO SIMULATION GROUNDED IN HISTORICAL SUPPLY/DEMAND ELASTICITY. NOT AN ACTUAL GUARANTEED OUTCOME.",
    scenarioId: "scen-chennai-robotic-trainers",
    scenarioTitle: "Scenario C: +45 Robotic Welding Master Trainers in Tamil Nadu ITIs",
    baseline: {
      demand: 3800,
      supply: 1200,
      netGap: 2600,
      placementRate: 52,
      estimatedBudgetINR: 8000000,
    },
    projected: {
      demand: 3800,
      supply: 2250,
      netGap: 1550,
      placementRate: 82,
      estimatedBudgetINR: 14000000,
    },
    impactSummary: "Unlocks 1,050 additional job-ready robotics operators across Oragadam cluster, lifting placement rate by +30 percentage points.",
    roiAssessment: "High leverage: ₹1.4 Cr investment yields 1,050 placed technicians with average entry CTC of ₹4.8 LPA.",
    confidence: 0.94,
    generatedAt: "2026-02-25T10:00:00Z",
  },
];
