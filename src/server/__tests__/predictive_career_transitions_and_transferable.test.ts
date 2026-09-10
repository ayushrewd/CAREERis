import { describe, it, expect } from "vitest";
import { careerTrajectoryService } from "@/server/services/career/careerTrajectoryService";

describe("Career Transition & Transferable Skills Scoring", () => {
  it("should evaluate role transition compatibility and score transferable skills", async () => {
    const trans = await careerTrajectoryService.analyzeCareerTransition("Manual Arc Welder", "Robotic Welding Specialist");
    expect(trans).toBeDefined();
    expect(trans.overallMatchScore).toBeGreaterThanOrEqual(70);
    expect(trans.transferableSkills.length).toBeGreaterThan(0);
    expect(trans.gapSkills.length).toBeGreaterThan(0);

    const hasDirect = trans.transferableSkills.some((s) => s.transferability === "DIRECTLY_TRANSFERABLE");
    expect(hasDirect).toBe(true);

    const hasGap = trans.gapSkills.some((g) => g.priority === "CRITICAL");
    expect(hasGap).toBe(true);
  });
});
