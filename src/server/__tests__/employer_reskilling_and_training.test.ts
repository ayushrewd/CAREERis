import { describe, it, expect } from "vitest";
import { reskillingAndTrainingService } from "@/server/services/employer/reskillingAndTrainingService";

describe("Employer Reskilling Pathways & Training Discovery", () => {
  it("should retrieve structured internal reskilling pathways", async () => {
    const pathways = await reskillingAndTrainingService.getReskillingPathways("emp-tata-motors");
    expect(pathways.length).toBeGreaterThan(0);
    expect(pathways[0].sourceRoleTitle).toContain("ICE Engine Assembly Technician");
    expect(pathways[0].targetRoleTitle).toContain("EV Battery System Calibration Specialist");
    expect(pathways[0].gapSkills.length).toBeGreaterThan(0);
  });

  it("should discover accredited local ITI and COE training partners", async () => {
    const partners = await reskillingAndTrainingService.getTrainingPartners();
    expect(partners.length).toBeGreaterThan(0);
    expect(partners[0].providerName).toContain("Government ITI Aundh");
    expect(partners[0].placementTrackRecordPercentage).toBeGreaterThan(80);
    expect(partners[0].isNcvdAccredited).toBe(true);
  });
});
