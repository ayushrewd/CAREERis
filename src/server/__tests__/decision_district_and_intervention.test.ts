import { describe, it, expect } from "vitest";
import { districtActionService } from "@/server/services/intelligence/decision/districtActionService";
import { interventionService } from "@/server/services/intelligence/decision/interventionService";
import { scenarioEngine } from "@/server/services/intelligence/decision/scenarioEngine";
import { skillPriorityService } from "@/server/services/intelligence/decision/skillPriorityService";
import { trainingAccessGapService } from "@/server/services/intelligence/decision/trainingAccessGapService";

describe("Decision Intelligence: District Action Plans, Interventions & Simulations", () => {
  it("generates comprehensive district skill and training profile with actionable recommendations", async () => {
    const profile = await districtActionService.generateDistrictProfile("dist-mh-pun");

    expect(profile.districtId).toBe("dist-mh-pun");
    expect(profile.districtName).toBe("Pune");
    expect(profile.summaryMetrics.totalDemand).toBeGreaterThan(0);
    expect(profile.prioritySkills.length).toBeGreaterThan(0);
    expect(profile.recommendations.length).toBeGreaterThan(0);
    expect(profile.recommendations[0].priority).toBe("CRITICAL");
  });

  it("handles complete human governance intervention lifecycle: propose -> review -> update progress -> evaluate outcome", async () => {
    // 1. Propose
    const proposed = await interventionService.proposeIntervention({
      title: "Pilot Seating Expansion for Autonomous Cobots",
      type: "SEAT_EXPANSION",
      scope: "DISTRICT",
      targetSkillId: "skill-ros",
      targetDistrictId: "dist-ka-blr",
      reason: "High hiring deficit in Bengaluru robotics corridor",
      evidence: ["Wipro & Fanuc demand requisitions"],
      expectedOutcome: "Train 40 certified robotics technicians",
      baselineValue: 20,
      targetValue: 40,
      ownerName: "KSDC Bangalore",
      timelineMonths: 6,
      createdBy: "usr-admin-01",
    });

    expect(proposed.id).toBeDefined();
    expect(proposed.status).toBe("PROPOSED");

    // 2. Human Review & Approval
    const approved = await interventionService.reviewIntervention(
      proposed.id,
      "APPROVE",
      "KSDC State Secretary",
      "Approved with matching CSR industrial robot grant"
    );

    expect(approved?.status).toBe("APPROVED");
    expect(approved?.approvedBy).toBe("KSDC State Secretary");

    // 3. Progress Update
    const inProgress = await interventionService.updateProgress(proposed.id, 38, true);
    expect(inProgress?.status).toBe("COMPLETED");
    expect(inProgress?.actualValue).toBe(38);

    // 4. Outcome Evaluation
    const evalRes = await interventionService.evaluateOutcome(proposed.id);
    expect(evalRes).not.toBeNull();
    expect(evalRes?.achievementPercentage).toBe(90);
    expect(evalRes?.isCausalEstablished).toBe(false);
  });

  it("executes policy what-if scenario simulations with explicit simulation labeling", async () => {
    const sim = await scenarioEngine.runSimulation({
      scenarioType: "SEAT_CAPACITY_CHANGE",
      targetSkillId: "skill-bms",
      changePercentage: 25,
      timeHorizonQuarters: 4,
    });

    expect(sim.label).toBe("SIMULATION");
    expect(sim.scenarioType).toBe("SEAT_CAPACITY_CHANGE");
    expect(sim.projectedSupplyDelta).toBeGreaterThan(0);
    expect(sim.projectedMetrics.capacity).toBeGreaterThan(sim.baselineMetrics.capacity);
    expect(sim.caveats.length).toBeGreaterThan(0);
  });

  it("evaluates multi-factor strategic skill prioritisation", async () => {
    const priority = await skillPriorityService.evaluateSkillPriority("skill-bms");

    expect(priority.skillId).toBe("skill-bms");
    expect(priority.priorityScore).toBeGreaterThan(50);
    expect(priority.classifications).toContain("CRITICAL_SHORTAGE");
    expect(priority.classifications).toContain("EMERGING");
  });

  it("evaluates geographic training access gaps and training deserts", async () => {
    const gap = await trainingAccessGapService.evaluateDistrictAccess("dist-mh-pun");
    expect(gap.districtName).toBe("Pune");
    expect(gap.accessSeverity).toBe("ADEQUATE_ACCESS");
  });
});
