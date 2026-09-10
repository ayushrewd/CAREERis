import { describe, it, expect } from "vitest";
import { trainingCapacityService } from "@/server/services/intelligence/decision/trainingCapacityService";
import { trainerCapacityService } from "@/server/services/intelligence/decision/trainerCapacityService";
import { equipmentCapacityService } from "@/server/services/intelligence/decision/equipmentCapacityService";

describe("Decision Intelligence: Capacity, Faculty & Lab Infrastructure", () => {
  it("calculates seating, enrollment, attendance and capacity utilization", async () => {
    const metrics = await trainingCapacityService.getCapacityMetrics("course-bms-01");

    expect(metrics.courseId).toBe("course-bms-01");
    expect(metrics.approvedSeats).toBe(35);
    expect(metrics.enrolled).toBe(32);
    expect(metrics.capacityUtilizationPct).toBe(91);
    expect(metrics.status).toBe("OPTIMAL");
    expect(metrics.attendanceRate).toBeGreaterThan(80);
    expect(metrics.completionRate).toBeGreaterThan(80);
    expect(metrics.certifiedCount).toBeGreaterThan(0);
    expect(metrics.verifiedSkillOutcomes).toBeGreaterThan(0);
  });

  it("evaluates required vs available master trainer competency gaps", async () => {
    const gap = await trainerCapacityService.evaluateTrainerGap("skill-bms", "Pune");

    expect(gap.skillId).toBe("skill-bms");
    expect(gap.district).toBe("Pune");
    expect(gap.requiredTrainers).toBeGreaterThan(0);
    expect(gap.availableTrainers).toBeGreaterThan(0);
    expect(gap.confidence).toBeGreaterThan(0.9);
  });

  it("evaluates laboratory testbed shortages and simulated capacity impact", async () => {
    const gaps = await equipmentCapacityService.evaluateEquipmentGap("course-bms-01");

    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps[0].requiredUnits).toBeDefined();
    expect(gaps[0].operationalUnits).toBeDefined();
    expect(gaps[0].studentDemand).toBe(35);
    expect(gaps[0].confidence).toBeGreaterThan(0.9);
  });
});
