import { describe, it, expect } from "vitest";
import { careerJourneyService } from "@/server/services/career/careerJourneyService";

describe("Longitudinal Career Journey & Milestones", () => {
  it("should retrieve chronological career milestones from initial profile to 180d/365d retention", async () => {
    const milestones = await careerJourneyService.getJourneyMilestones("cand-rohit-01");
    expect(milestones.length).toBeGreaterThanOrEqual(6);
    expect(milestones[0].stage).toBe("PROFILE_CREATION");
    expect(milestones[milestones.length - 1].stage).toBe("RETENTION_MILESTONE");
    expect(milestones[3].evidenceUri).toBeDefined();
  });
});
