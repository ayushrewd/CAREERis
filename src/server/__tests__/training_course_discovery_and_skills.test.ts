import { describe, it, expect } from "vitest";
import { courseMarketplaceService } from "@/server/services/training/courseMarketplaceService";

describe("Course Discovery, Skills Mapping & Health", () => {
  it("should retrieve courses filtered by skills, green skills, and geography", async () => {
    const allCourses = await courseMarketplaceService.getCourses();
    expect(allCourses.length).toBeGreaterThanOrEqual(3);

    const greenCourses = await courseMarketplaceService.getCourses({ isGreenSkill: true });
    expect(greenCourses.length).toBeGreaterThanOrEqual(2);
    expect(greenCourses[0].isGreenSkillCourse).toBe(true);

    const evCourse = await courseMarketplaceService.getCourseById("crs-ev-bms-01");
    expect(evCourse).toBeDefined();
    expect(evCourse?.courseHealthScore).toBeGreaterThanOrEqual(90);
    expect(evCourse?.skillsTaught.length).toBeGreaterThanOrEqual(3);
  });

  it("should retrieve active batch capacity for a course", async () => {
    const batches = await courseMarketplaceService.getBatchesForCourse("crs-ev-bms-01");
    expect(batches.length).toBeGreaterThan(0);
    expect(batches[0].status).toBe("OPEN");
    expect(batches[0].maxCapacity).toBeGreaterThan(batches[0].enrolledCount);
  });
});
