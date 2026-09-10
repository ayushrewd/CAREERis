// ==============================================================================
// CAREERIS CANONICAL BUDGETS & BUDGET-TO-OUTCOME DATA
// Financial Governance, Scheme Utilization & Cost-Per-Placement ROI
// ==============================================================================

import { BudgetAllocation, BudgetOutcomeMetrics } from "@/types/governmentIntelligence";

export const CANONICAL_BUDGET_ALLOCATIONS: BudgetAllocation[] = [
  {
    id: "budget-pmkvy-national-2025",
    fiscalYear: "FY 2025-26",
    schemeCode: "PMKVY_4",
    programId: "prog-pmkvy-4",
    geographyScope: "NATIONAL",
    allocatedINR: 5000000000, // ₹500 Cr
    committedINR: 4200000000,
    releasedINR: 3800000000,
    spentINR: 3420000000,    // ₹342 Cr
    remainingINR: 1580000000,
    utilizationPercentage: 68.4,
    linkedInterventionsCount: 14,
  },
  {
    id: "budget-mh-naps-2025",
    fiscalYear: "FY 2025-26",
    schemeCode: "NAPS",
    programId: "prog-naps-auto",
    geographyScope: "STATE",
    stateCode: "MH",
    allocatedINR: 1200000000, // ₹120 Cr
    committedINR: 1050000000,
    releasedINR: 980000000,
    spentINR: 890000000,     // ₹89 Cr
    remainingINR: 310000000,
    utilizationPercentage: 74.2,
    linkedInterventionsCount: 6,
  },
  {
    id: "budget-ka-skillconnect-2025",
    fiscalYear: "FY 2025-26",
    schemeCode: "STATE_SKILL_MISSION",
    programId: "prog-ka-skillconnect",
    geographyScope: "STATE",
    stateCode: "KA",
    allocatedINR: 2100000000, // ₹210 Cr
    committedINR: 1850000000,
    releasedINR: 1750000000,
    spentINR: 1620000000,    // ₹162 Cr
    remainingINR: 480000000,
    utilizationPercentage: 77.1,
    linkedInterventionsCount: 8,
  },
  {
    id: "budget-tn-naanmudhalvan-2025",
    fiscalYear: "FY 2025-26",
    schemeCode: "STATE_SKILL_MISSION",
    programId: "prog-tn-naan-mudhalvan",
    geographyScope: "STATE",
    stateCode: "TN",
    allocatedINR: 1800000000, // ₹180 Cr
    committedINR: 1500000000,
    releasedINR: 1380000000,
    spentINR: 1250000000,    // ₹125 Cr
    remainingINR: 550000000,
    utilizationPercentage: 69.4,
    linkedInterventionsCount: 7,
  },
  {
    id: "budget-pune-coe-2025",
    fiscalYear: "FY 2025-26",
    schemeCode: "NAPS",
    programId: "prog-naps-auto",
    geographyScope: "DISTRICT",
    stateCode: "MH",
    districtId: "dist-pune",
    allocatedINR: 35000000,  // ₹3.5 Cr
    committedINR: 35000000,
    releasedINR: 35000000,
    spentINR: 28000000,      // ₹2.8 Cr
    remainingINR: 7000000,
    utilizationPercentage: 80.0,
    linkedInterventionsCount: 1,
  },
];

export const CANONICAL_BUDGET_OUTCOME_METRICS: BudgetOutcomeMetrics = {
  totalBudgetSpentINR: 7180000000, // ₹718 Cr across sampled schemes
  totalTraineesEnrolled: 690000,
  totalCompletions: 602500,
  totalVerifiedSkillHolders: 426400,
  totalPlacements: 378700,
  costPerTraineeINR: 10405,
  costPerCompletionINR: 11917,
  costPerVerifiedCandidateINR: 16838,
  costPerPlacementINR: 18960,
  placementOutcomeRatePercentage: 62.8,
  employerSatisfactionIndex: 88,
  reportingPeriod: "Trailing 12 Months (FY 2025-26)",
  isDemoData: true,
};
