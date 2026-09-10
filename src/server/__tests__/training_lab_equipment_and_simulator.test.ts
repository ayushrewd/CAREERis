import { describe, it, expect } from "vitest";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";

describe("Lab Intelligence, Equipment Readiness & Failure Simulator", () => {
  it("should retrieve labs and hardware inventory", async () => {
    const labs = await labEquipmentService.getAllLabs();
    expect(labs.length).toBeGreaterThanOrEqual(3);
    expect(labs[0].operationalStatus).toBe("FULLY_OPERATIONAL");

    const equipment = await labEquipmentService.getAllEquipment();
    expect(equipment.length).toBeGreaterThanOrEqual(3);
    expect(equipment[0].readinessStatus).toBe("READY");
  });

  it("should execute equipment failure impact simulation labeled SIMULATION", async () => {
    const sim = await labEquipmentService.simulateEquipmentFailure("eq-bms-test-rig-01");
    expect(sim).toBeDefined();
    expect(sim.label).toBe("SIMULATION");
    expect(sim.disclaimer).toContain("EQUIPMENT FAILURE IMPACT SIMULATION");
    expect(sim.affectedStudentsCount).toBeGreaterThanOrEqual(24);
    expect(sim.potentialPlacementImpactPercentage).toBeLessThan(0);
    expect(sim.estimatedRepairCostINR).toBeGreaterThan(0);
  });
});
