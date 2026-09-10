// ==============================================================================
// CAREERIS CURRICULUM VERSION SERVICE
// Curriculum Versioning, Module Skill Mapping & Market Gap Alignment
// ==============================================================================

import { trainingOperationsRepository } from "@/server/repositories/trainingOperationsRepository";
import { CurriculumVersionRecord } from "@/types/trainingOperations";

export const curriculumVersionService = {
  async getCurriculumByCourseId(courseId: string): Promise<CurriculumVersionRecord | null> {
    return trainingOperationsRepository.getCurriculumByCourseId(courseId);
  },
};
