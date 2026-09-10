import { describe, it, expect } from "vitest";
import { nextBestActionService } from "@/server/services/career/nextBestActionService";

describe("Candidate Next Best Action Engine", () => {
  it("should return prioritized next best actions sorted by priority score", async () => {
    const actions = await nextBestActionService.getRankedActions("cand-rohit-01");
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].priorityScore).toBeGreaterThanOrEqual(actions[1].priorityScore);
    expect(actions[0].category).toBe("TAKE_ASSESSMENT");
  });
});
