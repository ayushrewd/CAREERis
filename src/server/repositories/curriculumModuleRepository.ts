// ==============================================================================
// CAREERIS CURRICULUM MODULE REPOSITORY
// Modular Course Content, Skill Mappings & Gap Evaluations Registry
// ==============================================================================

import {
  CurriculumModule,
  CurriculumGapEvaluation,
  CurriculumVersionStatus,
} from "@/types/trainingEcosystem";
import {
  CANONICAL_CURRICULUM_MODULES,
  CANONICAL_CURRICULUM_GAPS,
} from "@/data/canonicalCurriculumModulesData";

let inMemoryModules: CurriculumModule[] = JSON.parse(
  JSON.stringify(CANONICAL_CURRICULUM_MODULES)
);
let inMemoryGaps: Record<string, CurriculumGapEvaluation> = JSON.parse(
  JSON.stringify(CANONICAL_CURRICULUM_GAPS)
);

export const curriculumModuleRepository = {
  async findModulesByCourseId(courseId: string): Promise<CurriculumModule[]> {
    const q = courseId.toLowerCase();
    return inMemoryModules.filter(
      (m) =>
        m.courseId.toLowerCase() === q ||
        (q === "course-bms-01" && m.courseId === "course-bms-lead-01") ||
        (q === "course-bms-lead-01" && m.courseId === "course-bms-01") ||
        (q === "course-legacy-draft-01" && m.courseId === "course-legacy-welder-01")
    );
  },

  async findModuleById(moduleId: string): Promise<CurriculumModule | null> {
    const found = inMemoryModules.find((m) => m.moduleId === moduleId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createModule(data: Omit<CurriculumModule, "moduleId">): Promise<CurriculumModule> {
    const newMod: CurriculumModule = {
      ...data,
      moduleId: `mod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryModules.push(newMod);
    return newMod;
  },

  async updateModuleStatus(
    moduleId: string,
    status: CurriculumVersionStatus
  ): Promise<CurriculumModule | null> {
    const index = inMemoryModules.findIndex((m) => m.moduleId === moduleId);
    if (index === -1) return null;
    inMemoryModules[index].status = status;
    inMemoryModules[index].lastUpdated = new Date().toISOString();
    return inMemoryModules[index];
  },

  async getGapEvaluation(courseId: string): Promise<CurriculumGapEvaluation | null> {
    let found = inMemoryGaps[courseId];
    if (!found && courseId === "course-bms-01") {
      found = inMemoryGaps["course-bms-lead-01"];
    }
    if (found) return JSON.parse(JSON.stringify(found));

    // Generate fallback gap evaluation for unmapped course
    return {
      courseId,
      courseTitle: `Course (${courseId})`,
      freshnessStatus: "AGING",
      gapScore: 78,
      coveredSkills: [
        { skillId: "skill-bms", skillName: "Technical Competency", coverageStatus: "COVERED" },
      ],
      missingEmployerDemandedSkills: [
        { skillId: "skill-5axis-cnc", skillName: "Industry 4.0 Standard", marketDemandVolume: 1200 },
      ],
      outdatedModulesCount: 1,
      recommendedModifications: ["Update practical lab syllabus to align with latest sector standards."],
      employerFeedbackSignals: [],
      confidence: 0.90,
    };
  },

  async addEmployerFeedback(
    courseId: string,
    feedback: {
      employerName: string;
      missingSkillsNoted: string[];
      technologyGaps: string;
      conflictingSignalDetected: boolean;
    }
  ) {
    if (!inMemoryGaps[courseId]) {
      inMemoryGaps[courseId] = {
        courseId,
        courseTitle: `Course (${courseId})`,
        freshnessStatus: "FRESH",
        gapScore: 85,
        coveredSkills: [],
        missingEmployerDemandedSkills: [],
        outdatedModulesCount: 0,
        recommendedModifications: [],
        employerFeedbackSignals: [],
        confidence: 0.92,
      };
    }

    inMemoryGaps[courseId].employerFeedbackSignals.unshift({
      ...feedback,
      feedbackDate: new Date().toISOString().split("T")[0],
    });

    return inMemoryGaps[courseId];
  },
};
