import { describe, it, expect } from "vitest";
import { employerDemandValidationService } from "@/server/services/intelligence/decision/employerDemandValidationService";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { roleNormalizationService } from "@/server/services/intelligence/roleNormalizationService";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { courseHealthService } from "@/server/services/intelligence/decision/courseHealthService";
import { curriculumIntelligenceService } from "@/server/services/intelligence/decision/curriculumIntelligenceService";
import { trainerCapacityService } from "@/server/services/intelligence/decision/trainerCapacityService";
import { equipmentCapacityService } from "@/server/services/intelligence/decision/equipmentCapacityService";
import { districtActionService } from "@/server/services/intelligence/decision/districtActionService";
import { interventionService } from "@/server/services/intelligence/decision/interventionService";

describe("CareerIS Master Acceptance Test: End-to-End Decision Intelligence Closed-Loop", () => {
  it("executes the full closed-loop chain connecting Demand -> Skill -> Role -> Course -> Trainer -> Lab -> Intervention -> Outcome -> Intelligence", async () => {
    // 1. Employer Demand Signal
    const empSignal = await employerDemandValidationService.submitDemandSignal({
      employerId: "comp-tata-motors",
      employerName: "Tata Motors EV Division",
      industryId: "ind-auto-ev",
      district: "Pune",
      state: "Maharashtra",
      targetSkills: [
        { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", proficiency: "ADVANCED" },
      ],
      rolesNeeded: ["EV Battery Calibration Specialist"],
      hiringVolume: 120,
      hiringHorizon: "NEAR_TERM_6M",
      technologyAdoptionNotes: "Scaling 800V fast-charging battery packs",
      graduateReadinessRating: 4.2,
      period: "2026-Q2",
      confidence: 0.96,
      isDemoData: false,
    });
    expect(empSignal.id).toBeDefined();

    // 2. Canonical Skill Graph
    const skill = await skillGraphRepository.findById("skill-bms");
    expect(skill).not.toBeNull();
    expect(skill?.name).toBe("Battery Management Systems (BMS)");

    // 3. Role Normalization
    const roleNorm = await roleNormalizationService.normalizeRole("bms calibration engineer");
    expect(roleNorm.status).toBe("RESOLVED");
    expect(roleNorm.canonicalRole?.title).toContain("Battery");

    // 4. District Skill Gap
    const skillGap = await labourMarketGapService.calculateSkillGap("skill-bms", { districtId: "dist-mh-pun" });
    expect(skillGap.annualEmployerDemand).toBeGreaterThan(0);
    expect(skillGap.netGap).toBeGreaterThan(0);

    // 5. Course Health Evaluation
    const courseHealth = await courseHealthService.evaluateCourseHealth("course-bms-01");
    expect(courseHealth.courseId).toBe("course-bms-01");
    expect(courseHealth.overallScore).toBeGreaterThan(80);

    // 6. Curriculum Intelligence & Module Coverage
    const curriculum = await curriculumIntelligenceService.getCourseCurriculum("course-bms-01");
    expect(curriculum.modules.some((m) => m.skillId === "skill-bms")).toBe(true);

    // 7. Trainer Competency Gap
    const trainerGap = await trainerCapacityService.evaluateTrainerGap("skill-bms", "Pune");
    expect(trainerGap.requiredTrainers).toBeGreaterThan(0);

    // 8. Equipment & Lab Hardware Shortage
    const equipmentGaps = await equipmentCapacityService.evaluateEquipmentGap("course-bms-01");
    expect(equipmentGaps.length).toBeGreaterThan(0);

    // 9. District Action Recommendation Engine
    const districtProfile = await districtActionService.generateDistrictProfile("dist-mh-pun");
    expect(districtProfile.recommendations.length).toBeGreaterThan(0);
    const topRec = districtProfile.recommendations[0];
    expect(topRec.actionType).toBe("EXPAND_SEATS");

    // 10. Human Governance Intervention Lifecycle
    const proposed = await interventionService.proposeIntervention({
      title: topRec.title,
      type: topRec.actionType,
      scope: "DISTRICT",
      targetSkillId: "skill-bms",
      targetCourseId: "course-bms-01",
      targetDistrictId: "dist-mh-pun",
      reason: topRec.description,
      evidence: topRec.evidence,
      expectedOutcome: topRec.expectedImpact,
      baselineValue: 35,
      targetValue: 70,
      ownerName: "DVET Maharashtra",
      timelineMonths: 6,
      createdBy: "usr-admin-01",
    });
    expect(proposed.status).toBe("PROPOSED");

    // 11. Human Review & Approval
    const approved = await interventionService.reviewIntervention(
      proposed.id,
      "APPROVE",
      "Principal Secretary, Skill Development",
      "Approved under PM-KVY 4.0 Special Industrial Corridor Grant"
    );
    expect(approved?.status).toBe("APPROVED");

    // 12. Implementation Tracking & Associated Improvement
    const progress = await interventionService.updateProgress(proposed.id, 65, true);
    expect(progress?.status).toBe("COMPLETED");

    const outcome = await interventionService.evaluateOutcome(proposed.id);
    expect(outcome?.achievementPercentage).toBeGreaterThanOrEqual(85);
    expect(outcome?.isCausalEstablished).toBe(false); // Rigorous scientific honesty
  });
});
