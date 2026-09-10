import { IntelligenceRuleVersion } from "@/types/decisionIntelligence";

let inMemoryRules: IntelligenceRuleVersion[] = [
  {
    ruleId: "rule-course-health-v1",
    ruleName: "Course Health Multi-Factor Weighted Scoring Model",
    version: "1.2.0",
    effectiveFrom: "2026-01-01T00:00:00Z",
    parameters: {
      marketDemandWeight: 0.25,
      skillAlignmentWeight: 0.20,
      placementWeight: 0.20,
      curriculumFreshnessWeight: 0.15,
      employerSatisfactionWeight: 0.10,
      emergingSkillWeight: 0.05,
      capacityUtilizationWeight: 0.05,
    },
    createdBy: "usr-gov-sec-01",
    reason: "Standardized National Vocational Quality Framework (NVQF) 2026 Calibration",
    status: "ACTIVE",
  },
  {
    ruleId: "rule-obsolescence-v1",
    ruleName: "Course Obsolescence Multi-Warning Thresholds",
    version: "1.1.0",
    effectiveFrom: "2026-01-01T00:00:00Z",
    parameters: {
      placementCriticalThreshold: 40.0,
      curriculumAgeThresholdYears: 5.0,
      demandDeclineYoYThreshold: -15.0,
    },
    createdBy: "usr-gov-sec-01",
    reason: "National Skill Council Obsolescence Warning Guidelines",
    status: "ACTIVE",
  },
];

export const intelligenceRuleRepository = {
  async findActiveRule(ruleId: string): Promise<IntelligenceRuleVersion | null> {
    const found = inMemoryRules.find((r) => r.ruleId === ruleId && r.status === "ACTIVE");
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async findAllRules(): Promise<IntelligenceRuleVersion[]> {
    return [...inMemoryRules];
  },

  async registerVersion(rule: IntelligenceRuleVersion): Promise<IntelligenceRuleVersion> {
    inMemoryRules.forEach((r) => {
      if (r.ruleId === rule.ruleId && r.status === "ACTIVE") {
        r.status = "SUPERSEDED";
        r.effectiveTo = new Date().toISOString();
      }
    });
    inMemoryRules.unshift(rule);
    return rule;
  },
};
