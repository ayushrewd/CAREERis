import { describe, it, expect } from "vitest";
import { skillFirstRequisitionService } from "@/server/services/employer/skillFirstRequisitionService";

describe("Employer Skill-First Requisition Engine", () => {
  it("should retrieve requisitions with canonical skill weighting and health scores", async () => {
    const requisitions = await skillFirstRequisitionService.getRequisitions();
    expect(requisitions.length).toBeGreaterThanOrEqual(1);

    const req = requisitions[0];
    expect(req.title).toContain("EV Battery");
    expect(req.skills.length).toBeGreaterThanOrEqual(3);
    expect(req.healthScore).toBeGreaterThanOrEqual(90);
    expect(req.talentAvailabilityEstimate.hiringDifficulty).toBe("HIGH");
  });

  it("should create a new skill-first job requisition", async () => {
    const newReq = await skillFirstRequisitionService.createRequisition({
      title: "5-Axis CNC Specialist",
      roleTitle: "CNC Programmer",
      district: "Pune",
      state: "Maharashtra",
    });
    expect(newReq.requisitionId).toBeDefined();
    expect(newReq.title).toBe("5-Axis CNC Specialist");
  });
});
