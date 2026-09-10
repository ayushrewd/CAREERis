import { describe, it, expect } from "vitest";
import { adminSkillGovernanceService } from "../services/skill/adminSkillGovernanceService";
import { skillGraphRepository } from "../repositories/skillGraphRepository";
import { unresolvedSkillRepository } from "../repositories/unresolvedSkillRepository";

describe("CareerIS Admin Skill Governance Center", () => {
  it("should create new alias on canonical skill", async () => {
    const alias = await adminSkillGovernanceService.addAlias("skill-py", "Pythonic Programming", "ADMIN_TEST");
    expect(alias).toBeDefined();
    expect(alias?.alias).toBe("Pythonic Programming");

    const fetched = await skillGraphRepository.findById("skill-py");
    expect(fetched?.aliases.some((a) => a.alias === "Pythonic Programming")).toBe(true);
  });

  it("should link graph relationships between competencies", async () => {
    const rel = await adminSkillGovernanceService.addRelationship("skill-py", "skill-ros", "COMPLEMENTARY", 0.85);
    expect(rel).toBeDefined();
    expect(rel?.relationType).toBe("COMPLEMENTARY");
  });

  it("should preview merge impact before merging duplicate skills", async () => {
    const preview = await adminSkillGovernanceService.previewMerge("skill-py", "skill-sql");
    expect(preview.primarySkill.id).toBe("skill-py");
    expect(preview.secondarySkill.id).toBe("skill-sql");
    expect(preview.canSafelyMerge).toBe(true);
    expect(preview.affectedJobsCount).toBeGreaterThanOrEqual(0);
  });

  it("should moderate unresolved skills queue by approving resolution to an alias", async () => {
    const created = await unresolvedSkillRepository.create({
      rawText: "PyTorch Deep Learning",
      normalizedText: "pytorch deep learning",
      context: "Resume submission for AI research engineer",
      sourceEntity: "CANDIDATE_RESUME",
      confidence: 0.5,
      status: "REVIEW_REQUIRED",
    });

    const resolved = await adminSkillGovernanceService.resolveUnresolvedSkill(created.id, "skill-py");
    expect(resolved?.status).toBe("RESOLVED");
    expect(resolved?.resolvedSkillId).toBe("skill-py");

    const targetSkill = await skillGraphRepository.findById("skill-py");
    expect(targetSkill?.aliases.some((a) => a.alias === "PyTorch Deep Learning")).toBe(true);
  });

  it("should reject unresolved skill entry", async () => {
    const created = await unresolvedSkillRepository.create({
      rawText: "Gibberish 12345 Skill",
      normalizedText: "gibberish 12345 skill",
      context: "Spam submission",
      sourceEntity: "MANUAL",
      confidence: 0.0,
      status: "UNRESOLVED",
    });

    const rejected = await adminSkillGovernanceService.rejectUnresolvedSkill(created.id);
    expect(rejected?.status).toBe("REJECTED");
  });
});
