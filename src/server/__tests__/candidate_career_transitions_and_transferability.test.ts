import { describe, it, expect } from "vitest";
import { nationalCareerGuidanceService } from "@/server/services/career/nationalCareerGuidanceService";

describe("Career Transitions & Skill Transferability", () => {
  it("should calculate skill transferability percentages and identify gap skills", async () => {
    const transitions = await nationalCareerGuidanceService.getCareerTransitions();
    expect(transitions.length).toBeGreaterThan(0);

    const iceToEv = transitions[0];
    expect(iceToEv.fromRoleTitle).toContain("ICE Engine");
    expect(iceToEv.toRoleTitle).toContain("EV Battery System");
    expect(iceToEv.skillTransferabilityPercentage).toBeGreaterThanOrEqual(70);
    expect(iceToEv.sharedSkills.length).toBeGreaterThan(0);
    expect(iceToEv.gapSkills.length).toBeGreaterThan(0);
  });
});
