// ==============================================================================
// CAREERIS CANONICAL PROGRAMME OPERATIONS & IMPACT MEASUREMENT DATA
// Ground-Truth National Datasets across Pan-India Program Lifecycle & Governance
// ==============================================================================

import {
  Programme,
  ProgrammeBudget,
  InterventionExecution,
  BeneficiaryFunnel,
  ProgrammeRisk,
  DecisionRecord,
  OutcomeEvaluation,
  ExecutiveCommandCenterDigest,
  ESGAndGreenSkillsSummary,
} from "@/types/programmeOperations";

export const CANONICAL_PROGRAMMES: Programme[] = [
  {
    programmeId: "prog-pmkvy-ev-01",
    code: "PMKVY4-AUTO-EV-2026",
    name: "PMKVY 4.0 EV & Advanced Automotive Powertrain Mission",
    schemeName: "Pradhan Mantri Kaushal Vikas Yojana 4.0",
    department: "Ministry of Skill Development and Entrepreneurship (MSDE)",
    leadAgency: "Automotive Skills Development Council (ASDC) & Directorate of Vocational Education",
    scopeLevel: "NATIONAL",
    stateCode: "MH",
    districtId: "dist-pune",
    targetSkillIds: ["skill-bms", "skill-ev-diagnostics", "skill-plc-auto"],
    targetRoleIds: ["role-bms-specialist", "role-ev-assembly-tech"],
    targetIndustryIds: ["ind-automotive-ev", "ind-power-storage"],
    problemStatement:
      "Rapid OEM EV transition creates an acute shortage of 12,000+ certified battery pack and BMS diagnostic technicians across Chakan, Chennai, and Sanand clusters.",
    targetPopulationDescription: "ITI Electrician & Motor Mechanic graduates, Diploma engineers, and transitioning ICE automotive technicians.",
    theoryOfChange: {
      inputs: [
        "₹42.5 Cr central-state co-funded capital budget",
        "OEM-donated high-voltage battery test rigs and CAN bus analyzers",
        "Master trainer curriculum developed with Tata Motors & Mahindra Electric",
      ],
      activities: [
        "Commission 18 EV COE labs across Tier-1 auto clusters",
        "Retrain 160 ITI instructors with certified master credentials",
        "Conduct 6-month dual-training cohorts with 90-day OEM plant apprenticeships",
      ],
      outputs: [
        "4,800 technicians enrolled across 24 authorized institutes",
        "4,210 candidates successfully certified on ASDC/NCVT QP standards",
        "100% training facilities equipped with active safety interlocks",
      ],
      outcomes: [
        "3,620 certified technicians placed with verified starting wages ₹24,500/mo",
        "89.4% 365-day placement retention confirmed via EPFO records",
        "OEM assembly defect rates in battery harnesses reduced by 38%",
      ],
      impact: [
        "Accelerates national localized EV manufacturing under FAME-II & PLI",
        "Establishes a repeatable, self-sustaining high-tech skilling framework for India",
      ],
    },
    status: "ACTIVE",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2027-03-31T23:59:59Z",
    totalBudgetINR: 425000000,
    allocatedBudgetINR: 425000000,
    utilizedBudgetINR: 289400000,
    kpis: [
      {
        kpiId: "kpi-ev-01",
        programmeId: "prog-pmkvy-ev-01",
        metricName: "Technicians Certified",
        category: "OUTPUT",
        formula: "COUNT(Certified Candidates)",
        unit: "Candidates",
        baselineValue: 450,
        targetValue: 4500,
        currentValue: 4210,
        status: "ON_TRACK",
        period: "FY 2025-26",
        dataSource: "NCVT MIS & ASDC Assessment Registry",
        confidence: 96,
        owner: "Director of Skill Development",
      },
      {
        kpiId: "kpi-ev-02",
        programmeId: "prog-pmkvy-ev-01",
        metricName: "365-Day Placement Retention",
        category: "OUTCOME",
        formula: "(Retained at 365d / Total Placed) * 100",
        unit: "%",
        baselineValue: 62.0,
        targetValue: 85.0,
        currentValue: 89.4,
        status: "COMPLETED",
        period: "FY 2025-26",
        dataSource: "EPFO Ingestion & Employer Verification API",
        confidence: 94,
        owner: "Placement & Enterprise Outcomes Head",
      },
    ],
    createdAt: "2025-02-15T10:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
    ownerUserId: "user-gov-dir-01",
    ownerName: "Dr. Rajesh Kulkarni (Director General, MSDE/DSDA)",
  },
  {
    programmeId: "prog-dgt-dst-cnc-02",
    code: "DGT-DST-CNC-2026",
    name: "DGT Dual System of Training (DST) Precision CNC Modernization",
    schemeName: "Craftsmen Training Scheme (CTS) DST Modernization",
    department: "Directorate General of Training (DGT)",
    leadAgency: "National Council for Vocational Training (NCVT) & Capital Goods SSC",
    scopeLevel: "NATIONAL",
    stateCode: "MH",
    districtId: "dist-pune",
    targetSkillIds: ["skill-cnc-5axis", "skill-cimatron-cad", "skill-g-code"],
    targetRoleIds: ["role-cnc-machinist", "role-tool-die-maker"],
    targetIndustryIds: ["ind-precision-mfg", "ind-aerospace-defense"],
    problemStatement:
      "Modern aerospace and defense supply chains require 5-axis CNC machining capabilities, while 70% of legacy ITIs operate outdated 3-axis equipment.",
    targetPopulationDescription: "ITI Machinist & Turner trainees in Year 2 of CTS.",
    theoryOfChange: {
      inputs: ["₹28.0 Cr modernization budget", "5-axis industrial simulators", "Industry partner MOUs"],
      activities: ["Procure 48 5-axis CNC simulation rigs", "Embed 6-month industry shop-floor residency"],
      outputs: ["1,850 CNC technicians trained in advanced multi-axis machining"],
      outcomes: ["1,620 placements in aerospace & defense machining with ₹26,000/mo base"],
      impact: ["Bolsters domestic defense manufacturing supply chain resilience"],
    },
    status: "ACTIVE",
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2027-05-31T23:59:59Z",
    totalBudgetINR: 280000000,
    allocatedBudgetINR: 280000000,
    utilizedBudgetINR: 198500000,
    kpis: [
      {
        kpiId: "kpi-cnc-01",
        programmeId: "prog-dgt-dst-cnc-02",
        metricName: "Advanced CNC Certified",
        category: "OUTPUT",
        formula: "COUNT(Passed 5-Axis Practical)",
        unit: "Candidates",
        baselineValue: 200,
        targetValue: 2000,
        currentValue: 1850,
        status: "ON_TRACK",
        period: "FY 2025-26",
        dataSource: "NCVT Practical Exam Gateway",
        confidence: 95,
        owner: "State ITI Apprenticeship Advisor",
      },
    ],
    createdAt: "2025-05-10T10:00:00Z",
    updatedAt: "2026-02-15T12:00:00Z",
    ownerUserId: "user-gov-dst-02",
    ownerName: "Sunita Deshmukh (Joint Director, DGT)",
  },
];

export const CANONICAL_PROGRAMME_BUDGETS: ProgrammeBudget[] = [
  {
    budgetId: "bgt-pmkvy-ev-01",
    programmeId: "prog-pmkvy-ev-01",
    financialYear: "2025-2026",
    status: "UTILIZED",
    allocatedAmountINR: 425000000,
    committedAmountINR: 390000000,
    releasedAmountINR: 350000000,
    utilizedAmountINR: 289400000,
    remainingAmountINR: 135600000,
    utilizationPercentage: 68.1,
    burnRateINRPerMonth: 28940000,
    fundingSources: [
      {
        sourceId: "fsrc-msde-central",
        name: "MSDE Central Government Grant",
        type: "GOVERNMENT_CENTRAL",
        committedAmountINR: 255000000,
        releasedAmountINR: 210000000,
      },
      {
        sourceId: "fsrc-state-co-fund",
        name: "State Skill Development Matching Fund",
        type: "GOVERNMENT_STATE",
        committedAmountINR: 127500000,
        releasedAmountINR: 105000000,
      },
      {
        sourceId: "fsrc-csr-auto",
        name: "Auto Industry CSR Consortium (Tata/Mahindra)",
        type: "CSR_INDUSTRY",
        committedAmountINR: 42500000,
        releasedAmountINR: 35000000,
      },
    ],
    budgetLines: [
      {
        lineId: "bl-01",
        category: "LAB_EQUIPMENT",
        budgetedINR: 180000000,
        actualSpentINR: 168000000,
        committedINR: 175000000,
        varianceINR: 12000000,
        variancePercentage: 6.7,
        varianceStatus: "ON_PLAN",
      },
      {
        lineId: "bl-02",
        category: "TRAINING_SEATS",
        budgetedINR: 145000000,
        actualSpentINR: 78400000,
        committedINR: 125000000,
        varianceINR: 66600000,
        variancePercentage: 45.9,
        varianceStatus: "UNDERSPEND",
        correctiveAction: "Accelerate batch intake across 6 newly certified Tier-2 ITI labs.",
      },
      {
        lineId: "bl-03",
        category: "TRAINER_HONORARIUM",
        budgetedINR: 40000000,
        actualSpentINR: 24000000,
        committedINR: 35000000,
        varianceINR: 16000000,
        variancePercentage: 40.0,
        varianceStatus: "ON_PLAN",
      },
      {
        lineId: "bl-04",
        category: "PLACEMENT_INCENTIVES",
        budgetedINR: 60000000,
        actualSpentINR: 19000000,
        committedINR: 55000000,
        varianceINR: 41000000,
        variancePercentage: 68.3,
        varianceStatus: "ON_PLAN",
      },
    ],
    costPerOutcome: {
      costPerTraineeINR: 60291,
      costPerCertifiedCandidateINR: 68741,
      costPerPlacedCandidateINR: 79944,
      costPerRetainedCandidate365dINR: 89431,
      costPerVerifiedSkillAttainedINR: 22895,
      isFinancialROIExpressed: false,
      methodologyNote:
        "Calculated as (Total Actual Utilized Expenditure) / (Audited Outcome Cohort Volume). Verified via EPFO matching and NCVT certification registries.",
    },
    lastAuditedAt: "2026-02-15T09:00:00Z",
  },
];

export const CANONICAL_INTERVENTION_EXECUTIONS: InterventionExecution[] = [
  {
    interventionId: "int-ev-lab-chakan-01",
    programmeId: "prog-pmkvy-ev-01",
    title: "Chakan Industrial Cluster High-Voltage EV Lab & Rig Procurement",
    category: "LAB_EQUIPMENT_PROCUREMENT",
    stateCode: "MH",
    districtId: "dist-pune",
    clusterId: "cluster-chakan-auto",
    targetSkillIds: ["skill-bms", "skill-ev-diagnostics"],
    targetRoleIds: ["role-bms-specialist"],
    targetPopulation: "ITI Aundh and ITI Pimpri senior electrical apprentices",
    estimatedCapacity: 240,
    allocatedBudgetINR: 48000000,
    status: "COMPLETED",
    dependsOnInterventionIds: [],
    milestones: [
      {
        milestoneId: "ms-procure-01",
        interventionId: "int-ev-lab-chakan-01",
        title: "Tender and GeM Procurement of 4x Battery Testing Chambers",
        ownerName: "Executive Engineer (DSDA Pune)",
        dueDate: "2025-06-30T23:59:59Z",
        status: "COMPLETED",
        completionPercentage: 100,
        evidenceUri: "https://evidence.careeris.gov.in/tenders/gem-ev-pune-2025.pdf",
      },
      {
        milestoneId: "ms-install-02",
        interventionId: "int-ev-lab-chakan-01",
        title: "OEM Commissioning, High-Voltage Safety Audit & Interlock Certification",
        ownerName: "Lead Quality Auditor (Tata Motors / ARAI)",
        dueDate: "2025-08-31T23:59:59Z",
        status: "COMPLETED",
        dependsOnMilestoneId: "ms-procure-01",
        completionPercentage: 100,
        evidenceUri: "https://evidence.careeris.gov.in/audits/arai-safety-cert-2025.pdf",
      },
    ],
    explainability: {
      skillDeficitImpactScore: 94,
      demandIntensityScore: 92,
      trainingCapacityReadiness: 88,
      placementProbability: 95,
      costEfficiencyRatio: 91,
      compositePriorityScore: 92.4,
      whyThisIntervention:
        "Chakan cluster has an unfilled demand of 1,420 BMS calibration technicians. Establishing this high-voltage testing lab resolves 70% of the regional equipment bottleneck.",
      primaryAssumptions: [
        "OEM hiring commitments from Tata Motors and Mahindra Electric remain binding.",
        "Trainer cadre certification completes prior to batch commencement.",
      ],
    },
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-09-01T16:00:00Z",
  },
  {
    interventionId: "int-trainer-bms-02",
    programmeId: "prog-pmkvy-ev-01",
    title: "Master Trainer EV Retraining & Industry Deputation Cadre",
    category: "TRAINER_UPSKILLING",
    stateCode: "MH",
    districtId: "dist-pune",
    targetSkillIds: ["skill-bms"],
    targetRoleIds: ["role-bms-specialist"],
    targetPopulation: "Existing ITI Electrician Instructors with 5+ years tenure",
    estimatedCapacity: 60,
    allocatedBudgetINR: 12000000,
    status: "IN_PROGRESS",
    dependsOnInterventionIds: ["int-ev-lab-chakan-01"],
    milestones: [
      {
        milestoneId: "ms-trainer-dep-01",
        interventionId: "int-trainer-bms-02",
        title: "30-Day OEM Plant Deputation at Pune Battery Pack Facility",
        ownerName: "Head of Training (ASDC)",
        dueDate: "2026-03-15T23:59:59Z",
        status: "IN_PROGRESS",
        completionPercentage: 75,
      },
    ],
    explainability: {
      skillDeficitImpactScore: 90,
      demandIntensityScore: 89,
      trainingCapacityReadiness: 85,
      placementProbability: 92,
      costEfficiencyRatio: 94,
      compositePriorityScore: 90.1,
      whyThisIntervention:
        "Course delivery quality directly depends on instructors having hands-on experience with modern 400V/800V EV architectures.",
      primaryAssumptions: ["Participating ITIs release instructors for mandatory 30-day industrial rotation."],
    },
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2026-02-10T11:00:00Z",
  },
];

export const CANONICAL_BENEFICIARY_FUNNELS: BeneficiaryFunnel[] = [
  {
    programmeId: "prog-pmkvy-ev-01",
    totalEligible: 6200,
    enrolled: 4800,
    trainingStarted: 4650,
    trainingCompleted: 4320,
    assessed: 4280,
    certified: 4210,
    placed: 3620,
    retained30d: 3580,
    retained90d: 3490,
    retained180d: 3380,
    retained365d: 3236,
    placementQuality: {
      roleRelevanceScore: 94.2,
      skillRelevanceScore: 92.5,
      medianStartingSalaryINRMonth: 24500,
      formalSectorEmploymentRate: 98.4,
      greenJobPlacementRate: 100.0,
    },
    retentionRate365dPercentage: 89.4,
    drilldownByGender: {
      male: { enrolled: 3600, placed: 2750, retained365d: 2460 },
      female: { enrolled: 1200, placed: 870, retained365d: 776 },
    },
  },
];

export const CANONICAL_PROGRAMME_RISKS: ProgrammeRisk[] = [
  {
    riskId: "risk-ev-01",
    programmeId: "prog-pmkvy-ev-01",
    riskTitle: "OEM Production Schedule Delays Due to Global Cell Supply",
    category: "DEMAND",
    probability: 2,
    impact: 4,
    riskScore: 8,
    status: "MITIGATED",
    mitigationStrategy:
      "Diversified placement partnerships across 14 Tier-1 component suppliers and battery swapping network operators.",
    ownerName: "Director of Industry Partnerships",
    reviewDate: "2026-03-31T00:00:00Z",
  },
  {
    riskId: "risk-ev-02",
    programmeId: "prog-pmkvy-ev-01",
    riskTitle: "Shortage of Certified High-Voltage Master Trainers",
    category: "CAPACITY",
    probability: 3,
    impact: 4,
    riskScore: 12,
    status: "IDENTIFIED",
    mitigationStrategy:
      "Instituted ₹15,000/mo industry expert deputation stipend and accelerated 30-day fast-track TTT cohorts.",
    ownerName: "Head of Training (ASDC)",
    reviewDate: "2026-03-15T00:00:00Z",
  },
];

export const CANONICAL_DECISION_RECORDS: DecisionRecord[] = [
  {
    decisionId: "dec-bgt-release-01",
    decisionType: "BUDGET_ALLOCATION",
    targetEntityId: "prog-pmkvy-ev-01",
    targetEntityName: "PMKVY 4.0 EV Mission Lab Tranche 2",
    requesterId: "user-gov-finance-01",
    requesterName: "Anil Joshi (Finance Controller, DSDA)",
    requesterRole: "STATE_GOVERNMENT",
    approverId: "user-gov-dir-01",
    approverName: "Dr. Rajesh Kulkarni (Director General, MSDE)",
    approverRole: "NATIONAL_GOVERNMENT",
    status: "APPROVED",
    reason: "Tranche 1 lab commissioning milestones verified with 100% safety audit compliance.",
    evidenceSummary: "ARAI safety inspection sign-off and GeM procurement utilization certificates submitted.",
    fourEyesEnforced: true,
    requestedAt: "2026-01-10T10:00:00Z",
    approvedAt: "2026-01-12T14:30:00Z",
  },
];

export const CANONICAL_OUTCOME_EVALUATIONS: OutcomeEvaluation[] = [
  {
    evaluationId: "eval-ev-2026-01",
    programmeId: "prog-pmkvy-ev-01",
    evaluationType: "COHORT",
    baselineMetrics: {
      placementRatePercentage: 62.0,
      medianStartingSalaryINRMonth: 16500,
      retentionRate365dPercentage: 65.0,
      roleRelevanceScore: 68.0,
    },
    postInterventionMetrics: {
      placementRatePercentage: 86.0,
      medianStartingSalaryINRMonth: 24500,
      retentionRate365dPercentage: 89.4,
      roleRelevanceScore: 94.2,
    },
    observedImpactSummary:
      "Trained cohort demonstrated a +24.0% increase in formal placement rate and a +48.5% increase in starting wages relative to the pre-intervention baseline. 365-day job continuity was confirmed via EPFO matching.",
    confidenceLevel: 94,
    dataCompletenessPercentage: 98.2,
    causalityDisclaimer:
      "Evaluation employs a controlled cohort comparison. While outcomes are strongly correlated with curriculum modernization and OEM apprenticeships, macroeconomic EV vehicle demand expansion also contributed positively.",
    keyRecommendations: [
      "Expand dual-system apprenticeship model to 12 additional industrial districts.",
      "Integrate battery recycling and circular economy competencies into Phase 2 curriculum.",
    ],
    evaluatedAt: "2026-02-18T10:00:00Z",
    leadEvaluator: "National Institute of Labour Economics Research and Development (NILERD)",
  },
];

export const CANONICAL_EXECUTIVE_DIGEST: ExecutiveCommandCenterDigest = {
  whatIsHappening:
    "National EV and Precision Manufacturing skilling programmes are outperforming FY 2025-26 outcome targets, achieving 89.4% 365-day placement retention in automotive hubs.",
  whyIsItHappening:
    "Direct co-design with Tier-1 OEMs, deployment of high-voltage safety testing rigs, and mandatory 90-day plant apprenticeships have aligned training directly with industrial demand.",
  whereIsItHappening:
    "Primary momentum in Maharashtra (Pune/Chakan), Tamil Nadu (Sriperumbudur), and Gujarat (Sanand), with emerging traction in Karnataka (Hosur/Bengaluru).",
  whoIsAffected:
    "6,200+ vocational candidates, 160 master trainers, and 24 accredited ITIs/Polytechnic institutes across India.",
  whatShouldWeDo:
    "Authorize Phase 2 budget releases for Semiconductor Packaging and Green Hydrogen skilling to preempt 2027 industrial cluster skill deficits.",
  whatIsAlreadyBeingDone:
    "48 advanced CNC simulation labs operational; 18 EV COE facilities certified; 3,620 technicians successfully placed with verified EPFO tracking.",
  isItWorking:
    "Yes. Cost per 365d-retained candidate is ₹89,431 INR with 94.2% role relevance, representing high public expenditure efficiency.",
  howMuchDoesItCost:
    "Total committed budget: ₹70.5 Cr across active flagship schemes; utilization at 68.1% on-plan burn rate.",
  whatIsAtRisk:
    "High-voltage trainer shortage in Tier-2 ITIs poses a bottleneck for planned rural candidate intake expansions in Q3 2026.",
  topImprovements: [
    "365-Day Retention reached 89.4% (exceeding 85.0% target)",
    "Median starting salary increased by 48.5% to ₹24,500/month",
    "Zero reported high-voltage lab safety incidents across all 18 COE hubs",
  ],
  topDeteriorations: [
    "Trainer retraining intake in Tier-2 districts delayed by 2 weeks",
    "High-voltage test rig delivery lead times increased to 45 days",
  ],
  criticalAlertsCount: 2,
  totalActiveProgrammes: 4,
  totalCommittedBudgetINR: 705000000,
  overallPlacementRatePercentage: 86.0,
  overall365dRetentionRatePercentage: 89.4,
};

export const CANONICAL_ESG_SUMMARY: ESGAndGreenSkillsSummary = {
  greenSkillsDemandIndex: 88.5,
  greenTrainingCapacityTotal: 5200,
  greenJobPlacementsCount: 3620,
  socialEquityInclusionRate: 25.0, // 25% female in core industrial technical trades
  governanceComplianceScore: 98.6, // 98.6% four-eyes compliance on financial releases
};
