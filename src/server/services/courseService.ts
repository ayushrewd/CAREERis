import { courseRepository } from "@/server/repositories/courseRepository";

export const courseService = {
  async getCourses(params?: { search?: string; providerId?: string; page?: number; pageSize?: number }) {
    return courseRepository.findAllCourses(params);
  },

  async getCourseById(id: string) {
    return courseRepository.findCourseById(id);
  },

  async getProviders() {
    return courseRepository.findAllProviders();
  },

  async getProviderById(id: string) {
    return courseRepository.findProviderById(id);
  },
};
