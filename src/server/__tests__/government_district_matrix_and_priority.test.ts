import { describe, it, expect } from "vitest";
import { districtMatrixService } from "@/server/services/government/districtMatrixService";
import { districtActionCenterService } from "@/server/services/government/districtActionCenterService";

describe("District Skill Gap Matrix & Action Center", () => {
  it("retrieves district skill gap matrix with deficit classifications", async () => {
    const matrix = await districtMatrixService.getDistrictSkillMatrix();
    expect(matrix.length).toBeGreaterThan(0);

    const puneRow = matrix.find((r) => r.districtId === "dist-pune");
    expect(puneRow).toBeDefined();
    expect(puneRow?.priorityCategory).toBe("CRITICAL");
    expect(puneRow?.skills["skill-bms"]?.gapClassification).toBe("CRITICAL_GAP");
  });

  it("answers 'What Should This District Do Next?' in district action center", async () => {
    const dossier = await districtActionCenterService.getDistrictActionDossier("dist-pune");
    expect(dossier).toBeDefined();
    expect(dossier.districtName).toBe("Pune");
    expect(dossier.whatShouldThisDistrictDoNext.length).toBeGreaterThan(0);
    expect(dossier.whatShouldThisDistrictDoNext[0].actionTitle).toContain("High-Voltage BMS");
  });
});
