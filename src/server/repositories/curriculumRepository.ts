import { CurriculumHealthDetail } from "@/types/decisionIntelligence";
import { CANONICAL_CURRICULA } from "@/data/canonicalCurriculumData";

let inMemoryCurricula: CurriculumHealthDetail[] = JSON.parse(JSON.stringify(CANONICAL_CURRICULA));

export const curriculumRepository = {
  async findByCourseId(courseId: string): Promise<CurriculumHealthDetail | null> {
    const found = inMemoryCurricula.find((c) => c.courseId.toLowerCase() === courseId.toLowerCase());
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async findAll(): Promise<CurriculumHealthDetail[]> {
    return [...inMemoryCurricula];
  },

  async save(detail: CurriculumHealthDetail): Promise<CurriculumHealthDetail> {
    const index = inMemoryCurricula.findIndex((c) => c.courseId === detail.courseId);
    if (index >= 0) {
      inMemoryCurricula[index] = detail;
    } else {
      inMemoryCurricula.push(detail);
    }
    return detail;
  },
};
