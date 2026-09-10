import { TrainerGapMetric } from "@/types/decisionIntelligence";
import { trainerRepository } from "@/server/repositories/trainerRepository";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { courseRepository } from "@/server/repositories/courseRepository";

export const trainerCapacityService = {
  async evaluateTrainerGap(skillId: string, district?: string): Promise<TrainerGapMetric> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;

    const trainers = await trainerRepository.findAll({ skillId, district });
    const availableTrainers = trainers.length;

    // Calculate required trainers based on active courses teaching this skill
    const coursesRes = await courseRepository.findAll({ search: skillId });
    const activeCoursesCount = coursesRes.items.length || 1;
    const requiredTrainers = Math.max(2, activeCoursesCount * 2);

    const netGap = Math.max(0, requiredTrainers - availableTrainers);
    let severity: TrainerGapMetric["severity"] = "LOW";
    if (netGap >= 3 || availableTrainers === 0) severity = "CRITICAL";
    else if (netGap === 2) severity = "HIGH";
    else if (netGap === 1) severity = "MEDIUM";

    let retrainingRecommendation = "Faculty baseline adequate.";
    if (severity === "CRITICAL" || severity === "HIGH") {
      retrainingRecommendation = `Fast-track NSTI / DGT Faculty Development Program to retrain ${netGap} existing electrical/mechanical instructors in ${skillName}.`;
    }

    return {
      skillId,
      skillName,
      district: district || "Pune",
      state: "Maharashtra",
      requiredTrainers,
      availableTrainers,
      netGap,
      severity,
      retrainingRecommendation,
      affectedCoursesCount: activeCoursesCount,
      confidence: 0.94,
    };
  },

  async getAllTrainerGaps(district?: string): Promise<TrainerGapMetric[]> {
    const skillsRes = await skillGraphRepository.findAll({ pageSize: 50 });
    const results: TrainerGapMetric[] = [];
    for (const s of skillsRes.items) {
      const gap = await this.evaluateTrainerGap(s.id, district);
      results.push(gap);
    }
    results.sort((a, b) => b.netGap - a.netGap);
    return results;
  },
};
