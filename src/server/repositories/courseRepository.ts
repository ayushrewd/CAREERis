import { Course, TrainingProvider } from "@/types";
import { DEMO_COURSES, DEMO_TRAINING_PROVIDERS } from "@/data/demoData";

let inMemoryCourses: Course[] = [...DEMO_COURSES];
let inMemoryProviders: TrainingProvider[] = [...DEMO_TRAINING_PROVIDERS];

export const courseRepository = {
  async findAll(params?: {
    search?: string;
    providerId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Course[]; total: number }> {
    return this.findAllCourses(params);
  },

  async findAllCourses(params?: {
    search?: string;
    providerId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Course[]; total: number }> {
    let items = [...inMemoryCourses];

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.trainingProviderName.toLowerCase().includes(q) ||
          c.skillsTaught?.some(
            (s) => s.skillId === params.search || s.name.toLowerCase().includes(q) || q.includes(s.name.toLowerCase())
          )
      );
    }
    if (params?.providerId) {
      items = items.filter((c) => c.trainingProviderId === params.providerId);
    }

    const total = items.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async findCourseById(id: string): Promise<Course | null> {
    const found = inMemoryCourses.find(
      (c) =>
        c.id === id ||
        c.code.toLowerCase() === id.toLowerCase() ||
        (id === "course-bms-lead-01" && c.id === "course-bms-01") ||
        (id === "course-legacy-welder-01" && c.id === "course-legacy-draft-01")
    );
    return found || null;
  },

  async findAllProviders(): Promise<TrainingProvider[]> {
    return [...inMemoryProviders];
  },

  async findProviderById(id: string): Promise<TrainingProvider | null> {
    const found = inMemoryProviders.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
    return found || null;
  },
};
