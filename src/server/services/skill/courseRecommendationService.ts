import { courseRepository } from "@/server/repositories/courseRepository";
import { skillGapService } from "./skillGapService";
import { Course } from "@/types";

export interface RecommendedCourseItem {
  course: Course;
  targetSkillId: string;
  targetSkillName: string;
  priorityScore: number; // 0 - 100
  urgency: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
}

export const courseRecommendationService = {
  async recommendCoursesForCandidate(candidateId: string, targetRoleId: string): Promise<RecommendedCourseItem[]> {
    const gapAnalysis = await skillGapService.analyzeCandidateVsRole(candidateId, targetRoleId);
    const unMetSkills = gapAnalysis.gapItems.filter((g) => g.gapStatus !== "MET");

    const recommendations: RecommendedCourseItem[] = [];

    for (const gap of unMetSkills) {
      const coursesRes = await courseRepository.findAll({ search: gap.skillName });

      if (coursesRes.items.length > 0) {
        const topCourse = coursesRes.items[0];
        const isCritical = gap.gapStatus === "MISSING";

        recommendations.push({
          course: topCourse,
          targetSkillId: gap.skillId,
          targetSkillName: gap.skillName,
          priorityScore: isCritical ? 95 : 75,
          urgency: isCritical ? "CRITICAL" : "HIGH",
          reason: isCritical
            ? `Closes complete competency gap in mandatory skill: ${gap.skillName} for ${gapAnalysis.targetRoleTitle}.`
            : `Advances current ${gap.currentProficiency} level to target ${gap.requiredProficiency} for ${gapAnalysis.targetRoleTitle}.`,
        });
      }
    }

    recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
    return recommendations;
  },
};
