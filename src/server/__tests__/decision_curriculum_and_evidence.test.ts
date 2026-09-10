import { describe, it, expect } from "vitest";
import { curriculumIntelligenceService } from "@/server/services/intelligence/decision/curriculumIntelligenceService";
import { employerDemandValidationService } from "@/server/services/intelligence/decision/employerDemandValidationService";
import { evidenceFusionService } from "@/server/services/intelligence/decision/evidenceFusionService";

describe("Decision Intelligence: Curriculum, Employer Validation & Evidence Fusion", () => {
  it("evaluates modular curriculum coverage and detects missing/outdated modules", async () => {
    const detail = await curriculumIntelligenceService.getCourseCurriculum("course-bms-01");

    expect(detail.courseId).toBe("course-bms-01");
    expect(detail.modules.length).toBeGreaterThan(0);
    expect(detail.curriculumGapScore).toBe(92);
    expect(detail.freshnessStatus).toBe("FRESH");
    expect(detail.emergingSkillsToIntegrate.length).toBeGreaterThan(0);
  });

  it("submits and retrieves structured employer demand signals", async () => {
    const signal = await employerDemandValidationService.submitDemandSignal({
      employerId: "comp-tata-motors",
      employerName: "Tata Motors EV",
      industryId: "ind-auto-ev",
      district: "Pune",
      state: "Maharashtra",
      targetSkills: [{ skillId: "skill-bms", skillName: "BMS", proficiency: "ADVANCED" }],
      rolesNeeded: ["Battery Diagnostic Lead"],
      hiringVolume: 50,
      hiringHorizon: "NEAR_TERM_6M",
      technologyAdoptionNotes: "Expanding cell testing lab",
      graduateReadinessRating: 4.5,
      period: "2026-Q2",
      confidence: 0.95,
      isDemoData: false,
    });

    expect(signal.id).toBeDefined();
    expect(signal.hiringVolume).toBe(50);
  });

  it("fuses multi-source evidence and detects conflicting signals when sources disagree", async () => {
    // Normal non-conflicting signal
    const normalFused = await evidenceFusionService.fuseEvidenceForSkill("skill-bms", "MH");
    expect(normalFused.hasConflict).toBe(false);
    expect(normalFused.overallDemandVolume).toBeGreaterThan(0);
    expect(normalFused.fusedConfidence).toBe(0.95);

    // Conflicting signal scenario (Manual draft: High web listings vs Low ground audit)
    const conflictFused = await evidenceFusionService.fuseEvidenceForSkill("skill-manual-draft", "MH");
    expect(conflictFused.hasConflict).toBe(true);
    expect(conflictFused.conflictDescription).toContain("Conflicting signals detected");
    expect(conflictFused.fusedConfidence).toBe(0.75);
  });
});
