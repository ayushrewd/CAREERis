import { describe, it, expect } from "vitest";
import { curriculumIntelligenceService } from "@/server/services/training/curriculumIntelligenceService";
import { RequestAuthContext } from "@/server/middleware/authContext";

const mockAuth: RequestAuthContext = {
  userId: "user-tp-01",
  fullName: "Dr. Anand Joshi",
  email: "principal@giti-pune.careeris.in",
  userRole: "TRAINING_PROVIDER",
  assignedStateCode: "MH",
  assignedDistrictId: "dist-pune",
  assignedProviderId: "inst-iti-aundh-pune",
};

describe("Curriculum Intelligence, Module Mapping & Gap Scoring", () => {
  it("should retrieve curriculum modules mapped to canonical skills", async () => {
    const modules = await curriculumIntelligenceService.getModulesByCourseId("course-bms-lead-01");
    expect(modules.length).toBeGreaterThanOrEqual(2);
    expect(modules[0].mappedSkillIds).toContain("skill-hv-safety");
    expect(modules[0].status).toBe("PUBLISHED");
  });

  it("should evaluate curriculum gap against employer demand", async () => {
    const gap = await curriculumIntelligenceService.getCurriculumGapAnalysis("course-bms-lead-01");
    expect(gap).toBeDefined();
    expect(gap?.gapScore).toBeGreaterThanOrEqual(90);
    expect(gap?.freshnessStatus).toBe("FRESH");
    expect(gap?.missingEmployerDemandedSkills.length).toBeGreaterThanOrEqual(1);
  });

  it("should submit employer feedback and audit the transaction", async () => {
    const result = await curriculumIntelligenceService.submitEmployerFeedback(
      "course-bms-lead-01",
      {
        employerName: "Tata Motors EV Division",
        missingSkillsNoted: ["CAN FD", "ISO 14229 Diagnostics"],
        technologyGaps: "Need fast charging simulator module",
      },
      mockAuth
    );
    expect(result).toBeDefined();
    expect(result.employerFeedbackSignals.length).toBeGreaterThanOrEqual(1);
  });
});
