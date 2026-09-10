import { describe, it, expect } from "vitest";
import { curriculumVersionService } from "@/server/services/training/curriculumVersionService";

describe("Curriculum Versioning & Modular Skill Alignment", () => {
  it("should retrieve active curriculum version with modular breakdowns", async () => {
    const cur = await curriculumVersionService.getCurriculumByCourseId("crs-ev-bms-01");
    expect(cur).toBeDefined();
    expect(cur?.versionNumber).toBe("v2.1");
    expect(cur?.modules.length).toBeGreaterThanOrEqual(4);
    expect(cur?.marketAlignmentScore).toBeGreaterThanOrEqual(90);
    expect(cur?.marketAlignmentStatus).toBe("ALIGNED");
    expect(cur?.modules[0].coveredSkills[0].skillName).toContain("High-Voltage Safety");
  });
});
