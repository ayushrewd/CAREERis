import { describe, it, expect } from "vitest";
import { roleForecastService } from "@/server/services/intelligence/roleForecastService";
import { careerTrajectoryService } from "@/server/services/career/careerTrajectoryService";

describe("Role Forecasting & Career Trajectory Engine", () => {
  it("should classify rising vs declining occupational roles", async () => {
    const bmsRole = await roleForecastService.getRoleForecastById("role-bms-specialist");
    expect(bmsRole?.trajectoryStatus).toBe("RISING");
    expect(bmsRole?.growthPercentage).toBeGreaterThan(50);

    const manualRole = await roleForecastService.getRoleForecastById("role-manual-welder");
    expect(manualRole?.trajectoryStatus).toBe("DECLINING");
    expect(manualRole?.growthPercentage).toBeLessThan(0);
  });

  it("should generate step-by-step career progression trajectory without false promises", async () => {
    const trajectories = await careerTrajectoryService.getCandidateTrajectories("cand-rohit-01");
    expect(trajectories.length).toBeGreaterThanOrEqual(1);

    const primary = trajectories[0];
    expect(primary.steps.length).toBeGreaterThanOrEqual(3);
    expect(primary.feasibilityScore).toBeGreaterThan(80);
    expect(primary.disclaimer).toContain("Potential pathway");
    expect(primary.whyThisPath.length).toBeGreaterThan(0);
  });
});
