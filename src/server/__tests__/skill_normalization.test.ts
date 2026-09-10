import { describe, it, expect } from "vitest";
import { skillNormalizationService } from "../services/skill/skillNormalizationService";
import { skillGraphRepository } from "../repositories/skillGraphRepository";
import { unresolvedSkillRepository } from "../repositories/unresolvedSkillRepository";

describe("CareerIS Canonical Skill Normalization & Resolution Engine", () => {
  it("should normalize 'Python' to canonical Python with 100% confidence", async () => {
    const res = await skillNormalizationService.normalizeSkill("Python");
    expect(res.status).toBe("RESOLVED");
    expect(res.canonicalSkill?.name).toBe("Python");
    expect(res.confidence).toBe(1.0);
  });

  it("should resolve 'Python programming' and 'PYTHON' to canonical Python", async () => {
    const res1 = await skillNormalizationService.normalizeSkill("Python programming");
    expect(res1.status).toBe("RESOLVED");
    expect(res1.canonicalSkill?.name).toBe("Python");

    const res2 = await skillNormalizationService.normalizeSkill("PYTHON");
    expect(res2.status).toBe("RESOLVED");
    expect(res2.canonicalSkill?.name).toBe("Python");
  });

  it("should resolve 'PowerBI' to canonical Power BI", async () => {
    const res = await skillNormalizationService.normalizeSkill("PowerBI");
    expect(res.status).toBe("RESOLVED");
    expect(res.canonicalSkill?.name).toBe("Power BI");
  });

  it("should resolve 'React JS' to canonical React", async () => {
    const res = await skillNormalizationService.normalizeSkill("React JS");
    expect(res.status).toBe("RESOLVED");
    expect(res.canonicalSkill?.name).toBe("React");
  });

  it("should resolve industry abbreviations like 'PLC' and 'ROS2'", async () => {
    const resPlc = await skillNormalizationService.normalizeSkill("PLC");
    expect(resPlc.status).toBe("RESOLVED");
    expect(resPlc.canonicalSkill?.name).toBe("Programmable Logic Controllers (PLC)");

    const resRos = await skillNormalizationService.normalizeSkill("ROS2");
    expect(resRos.status).toBe("RESOLVED");
    expect(resRos.canonicalSkill?.name).toBe("Industrial Robotics (ROS 2)");
  });

  it("should quarantine unknown skills to UnresolvedSkill without creating duplicate canonical skills", async () => {
    const initialSkills = await skillGraphRepository.findAll();
    const unknownTerm = "Quantum Cryogenic Quantum Bus Flashing XYZ";

    const res = await skillNormalizationService.normalizeSkill(unknownTerm, "Test Candidate Resume");
    expect(res.status).toBe("UNRESOLVED");
    expect(res.canonicalSkill).toBeUndefined();

    // Verify canonical skills count was NOT incremented
    const afterSkills = await skillGraphRepository.findAll();
    expect(afterSkills.total).toBe(initialSkills.total);

    // Verify record was quarantined
    const unres = await unresolvedSkillRepository.findAll();
    expect(unres.items.some((u) => u.rawText === unknownTerm)).toBe(true);
  });
});
