import { describe, it, expect } from "vitest";
import { executiveCommandCenterService } from "@/server/services/government/executiveCommandCenterService";

describe("Executive Command Center & 9-Question Digest", () => {
  it("should answer all 9 core executive questions with empirical data", async () => {
    const digest = await executiveCommandCenterService.getExecutiveDigest();
    expect(digest.whatIsHappening).toBeDefined();
    expect(digest.whyIsItHappening).toBeDefined();
    expect(digest.whereIsItHappening).toBeDefined();
    expect(digest.whoIsAffected).toBeDefined();
    expect(digest.whatShouldWeDo).toBeDefined();
    expect(digest.whatIsAlreadyBeingDone).toBeDefined();
    expect(digest.isItWorking).toBeDefined();
    expect(digest.howMuchDoesItCost).toBeDefined();
    expect(digest.whatIsAtRisk).toBeDefined();

    expect(digest.totalActiveProgrammes).toBeGreaterThan(0);
    expect(digest.overallPlacementRatePercentage).toBeGreaterThan(70);
  });
});
