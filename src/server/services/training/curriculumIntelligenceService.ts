// ==============================================================================
// CAREERIS CURRICULUM INTELLIGENCE SERVICE
// Course-to-Module Mapping, Gap Scoring, Version Lifecycle & Conflict Resolution
// ==============================================================================

import { curriculumModuleRepository } from "@/server/repositories/curriculumModuleRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import {
  CurriculumModule,
  CurriculumGapEvaluation,
  CurriculumVersionStatus,
} from "@/types/trainingEcosystem";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const curriculumIntelligenceService = {
  async getModulesByCourseId(courseId: string): Promise<CurriculumModule[]> {
    return curriculumModuleRepository.findModulesByCourseId(courseId);
  },

  async getCurriculumGapAnalysis(courseId: string): Promise<CurriculumGapEvaluation | null> {
    return curriculumModuleRepository.getGapEvaluation(courseId);
  },

  async createOrUpdateModule(
    data: Omit<CurriculumModule, "moduleId">,
    auth: RequestAuthContext
  ): Promise<CurriculumModule> {
    const created = await curriculumModuleRepository.createModule(data);

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "CURRICULUM_MODULE_CREATED",
      entity: "CurriculumModule",
      entityId: created.moduleId,
      details: {
        courseId: created.courseId,
        moduleName: created.moduleName,
        skillsCount: created.mappedSkillIds.length,
      },
    });

    return created;
  },

  async transitionModuleStatus(
    moduleId: string,
    newStatus: CurriculumVersionStatus,
    auth: RequestAuthContext
  ): Promise<CurriculumModule | null> {
    const updated = await curriculumModuleRepository.updateModuleStatus(moduleId, newStatus);

    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "CURRICULUM_VERSION_TRANSITIONED",
        entity: "CurriculumModule",
        entityId: moduleId,
        details: { newStatus, courseId: updated.courseId },
      });
    }

    return updated;
  },

  async submitEmployerFeedback(
    courseId: string,
    feedback: {
      employerName: string;
      missingSkillsNoted: string[];
      technologyGaps: string;
      conflictingSignalDetected?: boolean;
    },
    auth: RequestAuthContext
  ) {
    const res = await curriculumModuleRepository.addEmployerFeedback(courseId, {
      employerName: feedback.employerName || auth.fullName,
      missingSkillsNoted: feedback.missingSkillsNoted,
      technologyGaps: feedback.technologyGaps,
      conflictingSignalDetected: feedback.conflictingSignalDetected || false,
    });

    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "EMPLOYER_CURRICULUM_FEEDBACK_SUBMITTED",
      entity: "CurriculumGapEvaluation",
      entityId: courseId,
      details: {
        employerName: feedback.employerName,
        missingSkills: feedback.missingSkillsNoted,
      },
    });

    return res;
  },
};
