import { describe, it, expect } from "vitest";
import { interventionExecutionService } from "@/server/services/programme/interventionExecutionService";

describe("Intervention Execution & Milestone Dependency Graph", () => {
  it("should retrieve interventions and verify explainability scoring", async () => {
    const intvs = await interventionExecutionService.getAllInterventions();
    expect(intvs.length).toBeGreaterThan(0);

    const intv = await interventionExecutionService.getInterventionById("int-ev-lab-chakan-01");
    expect(intv).toBeDefined();
    expect(intv?.explainability.compositePriorityScore).toBeGreaterThan(80);
    expect(intv?.explainability.whyThisIntervention).toContain("Chakan cluster");
    expect(intv?.milestones.length).toBeGreaterThanOrEqual(2);
  });

  it("should update milestone progress and preserve audit details", async () => {
    const updated = await interventionExecutionService.updateMilestoneProgress("int-trainer-bms-02", {
      milestoneId: "ms-trainer-dep-01",
      interventionId: "int-trainer-bms-02",
      title: "30-Day OEM Plant Deputation at Pune Battery Pack Facility",
      ownerName: "Head of Training (ASDC)",
      dueDate: "2026-03-15T23:59:59Z",
      status: "COMPLETED",
      completionPercentage: 100,
    });

    expect(updated?.milestones[0].status).toBe("COMPLETED");
    expect(updated?.milestones[0].completionPercentage).toBe(100);
  });
});
