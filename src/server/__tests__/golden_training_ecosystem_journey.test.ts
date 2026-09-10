import { describe, it, expect } from "vitest";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { courseRepository } from "@/server/repositories/courseRepository";
import { instituteOperatingService } from "@/server/services/training/instituteOperatingService";
import { curriculumIntelligenceService } from "@/server/services/training/curriculumIntelligenceService";
import { trainerIntelligenceService } from "@/server/services/training/trainerIntelligenceService";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";
import { trainingFunnelService } from "@/server/services/training/trainingFunnelService";
import { courseHealthIntelligenceService } from "@/server/services/training/courseHealthIntelligenceService";
import { RequestAuthContext } from "@/server/middleware/authContext";

const mockAdminAuth: RequestAuthContext = {
  userId: "user-tp-01",
  fullName: "Dr. Anand Joshi",
  email: "principal@giti-pune.careeris.in",
  userRole: "TRAINING_PROVIDER",
  assignedStateCode: "MH",
  assignedDistrictId: "dist-pune",
  assignedProviderId: "inst-iti-aundh-pune",
};

describe("Golden Training Ecosystem Closed-Loop Journey", () => {
  it("should execute full closed-loop from Labour Demand to Curriculum Update and Updated Training Supply", async () => {
    // 1. Labour Demand & Regional Skill Gap
    const skillGap = await labourMarketGapService.calculateSkillGap("skill-bms");
    expect(skillGap).toBeDefined();
    expect(skillGap.annualEmployerDemand).toBeGreaterThan(0);

    // 2. Training Course & Institute Linkage
    const course = await courseRepository.findCourseById("course-bms-lead-01");
    expect(course).toBeDefined();
    expect(course?.skillsTaught?.some((s) => s.skillId === "skill-bms")).toBe(true);

    const institute = await instituteOperatingService.getInstituteById(course!.trainingProviderId);
    expect(institute).toBeDefined();
    expect(institute?.overallHealthScore).toBeGreaterThanOrEqual(80);

    // 3. Curriculum Modules & Ontological Mapping
    const modules = await curriculumIntelligenceService.getModulesByCourseId(course!.id);
    expect(modules.length).toBeGreaterThanOrEqual(2);
    expect(modules[0].mappedSkillIds).toContain("skill-hv-safety");

    // 4. Trainer Faculty Competency
    const trainers = await trainerIntelligenceService.getAllTrainers({ instituteId: institute!.id });
    expect(trainers.length).toBeGreaterThanOrEqual(1);
    expect(trainers.some((t) => t.assignedCourseIds.includes(course!.id))).toBe(true);

    // 5. Labs & Technical Equipment
    const labs = await labEquipmentService.getAllLabs({ instituteId: institute!.id });
    expect(labs.length).toBeGreaterThanOrEqual(1);
    const equipment = await labEquipmentService.getAllEquipment({ instituteId: institute!.id });
    expect(equipment.length).toBeGreaterThanOrEqual(1);

    // 6. Learning to Assessment, Verification & Placement Funnel
    const funnel = await trainingFunnelService.getFunnelStages();
    expect(funnel.length).toBe(9);
    expect(funnel[3].stageName).toBe("COMPLETED");
    expect(funnel[6].stageName).toBe("VERIFIED");
    expect(funnel[8].stageName).toBe("PLACED");

    // 7. Employer Feedback on Candidate Outcomes
    const feedbackResult = await curriculumIntelligenceService.submitEmployerFeedback(
      course!.id,
      {
        employerName: "Tata Motors EV Division",
        missingSkillsNoted: ["ISO 14229 UDS Diagnostics", "CAN FD Telemetry"],
        technologyGaps: "Fast charging protocol benches required",
        conflictingSignalDetected: false,
      },
      mockAdminAuth
    );
    expect(feedbackResult).toBeDefined();
    expect(feedbackResult.employerFeedbackSignals.length).toBeGreaterThanOrEqual(1);

    // 8. Course Health & Market Fit Evaluation
    const courseHealth = await courseHealthIntelligenceService.evaluateCourseHealth(course!.id);
    expect(courseHealth.healthScore).toBeGreaterThanOrEqual(85);
    expect(courseHealth.recommendedAction).toBe("EXPAND");

    const marketFit = await trainingFunnelService.getCourseMarketFitScore(course!.id);
    expect(marketFit?.overallFitScore).toBeGreaterThanOrEqual(90);
    expect(marketFit?.portfolioClassification).toBe("EXPAND");

    // 9. Curriculum Modernization & Update (Closing the Loop)
    const newModule = await curriculumIntelligenceService.createOrUpdateModule(
      {
        courseId: course!.id,
        moduleName: "ISO 14229 UDS Diagnostics & CAN FD Protocol Integration",
        description: "Advanced diagnostic protocols responding directly to Tata Motors 2026 model requisitions.",
        durationHours: 30,
        mappedSkillIds: ["skill-uds-diag", "skill-can-fd"],
        mappedSkillNames: ["UDS Diagnostic Protocol", "CAN FD Telemetry"],
        learningOutcomes: ["Execute ISO 14229 diagnostic routines", "Analyze CAN FD message frame arbitration"],
        assessmentMethodology: "Hardware Test Bench ECU Diagnostic Flash & Analysis",
        technologyStack: ["Vector CANoe", "ETAS INCA"],
        version: "v2.5",
        status: "APPROVED",
        lastUpdated: new Date().toISOString(),
        marketRelevanceScore: 99,
      },
      mockAdminAuth
    );
    expect(newModule.moduleId).toBeDefined();
    expect(newModule.status).toBe("APPROVED");

    // 10. Verified Updated Training Supply
    const updatedModules = await curriculumIntelligenceService.getModulesByCourseId(course!.id);
    expect(updatedModules.some((m) => m.moduleId === newModule.moduleId)).toBe(true);
  });
});
