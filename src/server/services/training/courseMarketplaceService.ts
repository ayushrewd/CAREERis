// ==============================================================================
// CAREERIS COURSE MARKETPLACE SERVICE
// Skill-First Course Discovery, Course Health & Batch Capacity
// ==============================================================================

import { trainingOperationsRepository } from "@/server/repositories/trainingOperationsRepository";
import { CourseDetailRecord, BatchRecord } from "@/types/trainingOperations";

export const courseMarketplaceService = {
  async getCourses(filters?: { district?: string; isGreenSkill?: boolean; query?: string }): Promise<CourseDetailRecord[]> {
    return trainingOperationsRepository.getCourses(filters);
  },

  async getCourseById(courseId: string): Promise<CourseDetailRecord | null> {
    return trainingOperationsRepository.getCourseById(courseId);
  },

  async getBatchesForCourse(courseId: string): Promise<BatchRecord[]> {
    return trainingOperationsRepository.getBatches(courseId);
  },
};
