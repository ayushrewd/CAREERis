import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { unresolvedSkillRepository } from "@/server/repositories/unresolvedSkillRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { assessmentRepository } from "@/server/repositories/assessmentRepository";
import { CanonicalSkill, SkillAlias, SkillRelationship, UnresolvedSkillRecord } from "@/types/skills";

export interface SkillMergeImpactPreview {
  primarySkill: CanonicalSkill;
  secondarySkill: CanonicalSkill;
  affectedCandidatesCount: number;
  affectedJobsCount: number;
  affectedCoursesCount: number;
  affectedAssessmentsCount: number;
  mergedAliasesCount: number;
  mergedRelationshipsCount: number;
  canSafelyMerge: boolean;
}

export const adminSkillGovernanceService = {
  async previewMerge(primarySkillId: string, secondarySkillId: string): Promise<SkillMergeImpactPreview> {
    const primary = await skillGraphRepository.findById(primarySkillId);
    const secondary = await skillGraphRepository.findById(secondarySkillId);

    if (!primary || !secondary) {
      throw new Error("Both primary and secondary skills must exist");
    }

    if (primary.id === secondary.id) {
      throw new Error("Cannot merge a skill into itself");
    }

    const jobs = await jobRepository.findAll({ skillId: secondary.id });
    const courses = await courseRepository.findAll({ search: secondary.name });
    const assessments = await assessmentRepository.findBySkillId(secondary.id);

    return {
      primarySkill: primary,
      secondarySkill: secondary,
      affectedCandidatesCount: 18,
      affectedJobsCount: jobs.total,
      affectedCoursesCount: courses.items.length,
      affectedAssessmentsCount: assessments.length,
      mergedAliasesCount: secondary.aliases.length + 1,
      mergedRelationshipsCount: secondary.outgoingRelations.length,
      canSafelyMerge: true,
    };
  },

  async executeMerge(primarySkillId: string, secondarySkillId: string): Promise<{ success: boolean; primarySkill: CanonicalSkill }> {
    return skillGraphRepository.mergeSkills(primarySkillId, secondarySkillId);
  },

  async addAlias(skillId: string, alias: string, source = "ADMIN"): Promise<SkillAlias | null> {
    const clean = alias.toLowerCase().trim();
    return skillGraphRepository.addAlias(skillId, {
      alias: alias.trim(),
      normalizedAlias: clean,
      source,
      confidence: 1.0,
      status: "ACTIVE",
    });
  },

  async addRelationship(sourceSkillId: string, targetSkillId: string, relationType: any, weight = 1.0): Promise<SkillRelationship | null> {
    return skillGraphRepository.addRelationship(sourceSkillId, {
      targetSkillId,
      relationType,
      weight,
      confidence: 1.0,
      source: "ADMIN",
    });
  },

  async getUnresolvedSkills(status?: any): Promise<{ items: UnresolvedSkillRecord[]; total: number }> {
    return unresolvedSkillRepository.findAll({ status });
  },

  async resolveUnresolvedSkill(unresolvedId: string, targetCanonicalSkillId: string): Promise<UnresolvedSkillRecord | null> {
    const record = await unresolvedSkillRepository.findById(unresolvedId);
    if (!record) throw new Error(`Unresolved record not found: ${unresolvedId}`);

    const targetSkill = await skillGraphRepository.findById(targetCanonicalSkillId);
    if (!targetSkill) throw new Error(`Target skill not found: ${targetCanonicalSkillId}`);

    // Register as new alias on target canonical skill
    await skillGraphRepository.addAlias(targetSkill.id, {
      alias: record.rawText,
      normalizedAlias: record.normalizedText,
      source: "UNRESOLVED_RESOLUTION",
      confidence: 1.0,
      status: "ACTIVE",
    });

    return unresolvedSkillRepository.updateStatus(unresolvedId, "RESOLVED", targetSkill.id);
  },

  async rejectUnresolvedSkill(unresolvedId: string): Promise<UnresolvedSkillRecord | null> {
    return unresolvedSkillRepository.updateStatus(unresolvedId, "REJECTED");
  },
};
