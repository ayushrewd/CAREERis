import { candidateRepository } from "@/server/repositories/candidateRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { SkillGapItem, ProficiencyLabel } from "@/types/skills";
import { skillEvidenceScoringService } from "./skillEvidenceScoringService";

const PROFICIENCY_RANKS: Record<ProficiencyLabel | "NONE", number> = {
  NONE: 0,
  FOUNDATIONAL: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
  MASTER: 5,
};

export interface SkillGapAnalysisResult {
  candidateId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  readinessPercentage: number; // 0 - 100
  totalRequiredSkills: number;
  metSkillsCount: number;
  partialSkillsCount: number;
  missingSkillsCount: number;
  gapItems: SkillGapItem[];
}

export const skillGapService = {
  async analyzeCandidateVsRole(candidateId: string, roleId: string): Promise<SkillGapAnalysisResult> {
    const candidate = await candidateRepository.getProfile(candidateId);
    const role = await roleRepository.findById(roleId);

    if (!role) {
      throw new Error(`Role not found: ${roleId}`);
    }

    const gapItems: SkillGapItem[] = [];
    const allRequirements = [...role.coreSkills, ...role.preferredSkills];

    let totalPoints = 0;
    let earnedPoints = 0;

    for (const req of allRequirements) {
      const requiredRank = PROFICIENCY_RANKS[req.minProficiency];
      const matchedCandSkill = candidate.skills.find(
        (cs) => cs.skillId === req.skillId || cs.skillName.toLowerCase() === req.skillName.toLowerCase()
      );

      let currentProficiency: ProficiencyLabel | "NONE" = "NONE";
      let currentRank = 0;
      let evidenceConfidence = 0.3;

      if (matchedCandSkill) {
        currentProficiency = (matchedCandSkill.claimedProficiency as ProficiencyLabel) || "FOUNDATIONAL";
        currentRank = PROFICIENCY_RANKS[currentProficiency];

        const scoreRes = skillEvidenceScoringService.scoreCandidateSkill({
          skillId: req.skillId,
          skillName: req.skillName,
          claimedProficiency: currentProficiency,
          assessedScore: matchedCandSkill.assessedScore,
          verificationStatus: matchedCandSkill.verificationStatus,
        });
        evidenceConfidence = scoreRes.confidenceScore;
      }

      let gapStatus: "MET" | "PARTIAL" | "MISSING" = "MISSING";
      let gapLevel = requiredRank;

      if (currentRank >= requiredRank) {
        gapStatus = "MET";
        gapLevel = 0;
        earnedPoints += req.weight * 100;
      } else if (currentRank > 0) {
        gapStatus = "PARTIAL";
        gapLevel = requiredRank - currentRank;
        earnedPoints += req.weight * (currentRank / requiredRank) * 100;
      }

      totalPoints += req.weight * 100;

      // Check prerequisites from graph
      const skillDetail = await skillGraphRepository.findById(req.skillId);
      const prerequisites = skillDetail
        ? skillDetail.outgoingRelations.filter((r) => r.relationType === "PREREQUISITE").map((r) => r.targetSkillName || r.targetSkillId)
        : [];

      // Find best course to close gap if missing or partial
      let recommendedCourseId: string | undefined;
      let recommendedCourseTitle: string | undefined;

      if (gapStatus !== "MET") {
        const courses = await courseRepository.findAll({ search: req.skillName });
        if (courses.items.length > 0) {
          recommendedCourseId = courses.items[0].id;
          recommendedCourseTitle = courses.items[0].title;
        }
      }

      gapItems.push({
        skillId: req.skillId,
        skillName: req.skillName,
        category: skillDetail?.categoryName || "Technical",
        requiredProficiency: req.minProficiency,
        currentProficiency,
        gapStatus,
        gapLevel,
        evidenceConfidence,
        prerequisites,
        recommendedCourseId,
        recommendedCourseTitle,
      });
    }

    const readinessPercentage = Math.round((earnedPoints / Math.max(1, totalPoints)) * 100);
    const metSkillsCount = gapItems.filter((g) => g.gapStatus === "MET").length;
    const partialSkillsCount = gapItems.filter((g) => g.gapStatus === "PARTIAL").length;
    const missingSkillsCount = gapItems.filter((g) => g.gapStatus === "MISSING").length;

    return {
      candidateId,
      targetRoleId: role.id,
      targetRoleTitle: role.title,
      readinessPercentage,
      totalRequiredSkills: allRequirements.length,
      metSkillsCount,
      partialSkillsCount,
      missingSkillsCount,
      gapItems,
    };
  },
};
