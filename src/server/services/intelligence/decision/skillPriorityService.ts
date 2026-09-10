import { StrategicSkillClassification } from "@/types/decisionIntelligence";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { emergingSkillService } from "@/server/services/intelligence/emergingSkillService";

export const skillPriorityService = {
  async evaluateSkillPriority(skillId: string): Promise<StrategicSkillClassification> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;

    const gap = await labourMarketGapService.calculateSkillGap(skillId);
    const emergingList = await emergingSkillService.getEmergingSkills();
    const emergingMetric = emergingList.find((e) => e.skillId === skillId);
    const isEmerging = skill?.isEmerging || !!emergingMetric;
    const emergingScore = emergingMetric?.emergingScore || (skill?.isEmerging ? 85 : 40);

    const classifications: StrategicSkillClassification["classifications"] = [];

    if (gap.marketTightness === "VERY_TIGHT") {
      classifications.push("CRITICAL_SHORTAGE");
    }
    if (isEmerging) {
      classifications.push("EMERGING");
    }
    if (skill?.isGreenSkill) {
      classifications.push("STRATEGIC");
    }
    if (gap.gapRatio > 2.0) {
      classifications.push("HIGH_PRIORITY");
    }
    if (classifications.length === 0) {
      classifications.push("STABLE");
    }

    // Composite Priority Score (0 - 100)
    let priorityScore = Math.min(
      100,
      Math.round(
        Math.min(40, (gap.annualEmployerDemand / 2500) * 40) +
        emergingScore * 0.4 +
        (skill?.isGreenSkill ? 20 : 0)
      )
    );

    let explanation = `Skill '${skillName}' demonstrates ${gap.marketTightness} market tightness with ${gap.annualEmployerDemand} annual hiring demand and emerging momentum score of ${emergingScore}/100.`;

    return {
      skillId,
      skillName,
      priorityScore,
      classifications,
      explanation,
      confidence: 0.96,
    };
  },

  async getAllPriorities(): Promise<StrategicSkillClassification[]> {
    const skillsRes = await skillGraphRepository.findAll({ pageSize: 50 });
    const results: StrategicSkillClassification[] = [];
    for (const s of skillsRes.items) {
      const p = await this.evaluateSkillPriority(s.id);
      results.push(p);
    }
    results.sort((a, b) => b.priorityScore - a.priorityScore);
    return results;
  },
};
