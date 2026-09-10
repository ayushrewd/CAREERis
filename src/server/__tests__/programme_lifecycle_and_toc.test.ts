import { describe, it, expect } from "vitest";
import { programmeService } from "@/server/services/programme/programmeService";

describe("Programme Lifecycle & Theory of Change", () => {
  it("should retrieve programmes and verify Theory of Change logical chain", async () => {
    const progs = await programmeService.getProgrammes();
    expect(progs.length).toBeGreaterThan(0);

    const evProg = await programmeService.getProgrammeById("prog-pmkvy-ev-01");
    expect(evProg).toBeDefined();
    expect(evProg?.code).toBe("PMKVY4-AUTO-EV-2026");
    expect(evProg?.scopeLevel).toBe("NATIONAL");

    const toc = await programmeService.getTheoryOfChange("prog-pmkvy-ev-01");
    expect(toc?.theoryOfChange.inputs.length).toBeGreaterThan(0);
    expect(toc?.theoryOfChange.activities.length).toBeGreaterThan(0);
    expect(toc?.theoryOfChange.outputs.length).toBeGreaterThan(0);
    expect(toc?.theoryOfChange.outcomes.length).toBeGreaterThan(0);
    expect(toc?.theoryOfChange.impact.length).toBeGreaterThan(0);
  });

  it("should enforce RBAC authorization on lifecycle status transitions", async () => {
    // Unauthorized user role should fail
    await expect(
      programmeService.transitionStatus("prog-pmkvy-ev-01", "COMPLETED", "CANDIDATE")
    ).rejects.toThrow("Unauthorized");

    // Authorized role should succeed
    const updated = await programmeService.transitionStatus("prog-pmkvy-ev-01", "ACTIVE", "NATIONAL_GOVERNMENT");
    expect(updated?.status).toBe("ACTIVE");
  });
});
