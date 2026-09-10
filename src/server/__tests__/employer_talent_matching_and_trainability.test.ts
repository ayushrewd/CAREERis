import { describe, it, expect } from "vitest";
import { talentMatchingAndTrainabilityService } from "@/server/services/employer/talentMatchingAndTrainabilityService";

describe("Employer Candidate Matching & Trainability Index", () => {
  it("should match candidates based on skill coverage and compute trainability indices", async () => {
    const candidates = await talentMatchingAndTrainabilityService.getMatchingCandidates("req-tata-ev-01");
    expect(candidates.length).toBeGreaterThanOrEqual(2);

    const rohit = candidates.find((c) => c.candidateName === "Rohit Sharma");
    expect(rohit).toBeDefined();
    expect(rohit?.classification).toBe("STRONG_MATCH");
    expect(rohit?.matchScore).toBe(86);
    expect(rohit?.hasVerifiedPassport).toBe(true);

    const priya = candidates.find((c) => c.candidateName === "Priya Nair");
    expect(priya).toBeDefined();
    expect(priya?.classification).toBe("TRAINABLE");
    expect(priya?.trainabilityIndex).toBeGreaterThanOrEqual(80);
  });
});
