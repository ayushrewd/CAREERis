import { describe, it, expect } from "vitest";
import { talentPoolService } from "@/server/services/employer/talentPoolService";

describe("Employer Talent Pools & Candidate Pipelines", () => {
  it("should retrieve talent pools and filter by verified skill criteria", async () => {
    const pools = await talentPoolService.getTalentPools("emp-tata-motors");
    expect(pools.length).toBeGreaterThan(0);
    expect(pools[0].name).toContain("High-Voltage EV Battery Technicians");
    expect(pools[0].candidateCount).toBeGreaterThan(0);
    expect(pools[0].filterCriteria.skills.length).toBeGreaterThan(0);
  });

  it("should create new dynamic talent pools", async () => {
    const created = await talentPoolService.createTalentPool({
      name: "Chakan Mechatronics Apprentices",
      employerId: "emp-tata-motors",
      tags: ["Mechatronics", "Apprentice"],
      candidateIds: ["cand-rohit-01"],
    });

    expect(created.poolId).toBeDefined();
    expect(created.name).toBe("Chakan Mechatronics Apprentices");
  });
});
