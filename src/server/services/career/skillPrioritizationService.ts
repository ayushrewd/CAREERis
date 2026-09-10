import { PrioritizedSkillItem } from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { emergingSkillService } from "@/server/services/intelligence/emergingSkillService";

export const skillPrioritizationService = {
  async getPrioritizedSkills(candidateId = "user-cand-01", targetRoleId = "role-bms-lead"): Promise<PrioritizedSkillItem[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const role = await roleRepository.findById(targetRoleId);

    const candidateSkillIds = new Set((candidate.skills || []).map((s) => s.skillId));
    const requiredSkills = role?.coreSkills || [
      { skillId: "skill-bms", name: "Battery Management Systems (BMS)", level: "ADVANCED" as const, isMandatory: true },
      { skillId: "skill-can", name: "CAN Bus Communication", level: "INTERMEDIATE" as const, isMandatory: true },
      { skillId: "skill-ros", name: "Industrial Robotics (ROS 2)", level: "ADVANCED" as const, isMandatory: false },
      { skillId: "skill-plc", name: "PLC Automation & SCADA", level: "INTERMEDIATE" as const, isMandatory: false },
    ];

    const results: PrioritizedSkillItem[] = [];
    let rank = 1;

    for (const req of requiredSkills) {
      const isOwned = candidateSkillIds.has(req.skillId);
      const gap = await labourMarketGapService.calculateSkillGap(req.skillId);
      const emergingList = await emergingSkillService.getEmergingSkills();
      const isEmerging = emergingList.some((e) => e.skillId === req.skillId);

      let priorityLevel: PrioritizedSkillItem["priorityLevel"] = "MEDIUM";
      if (!isOwned && req.isMandatory) {
        priorityLevel = "CRITICAL";
      } else if (!isOwned && isEmerging) {
        priorityLevel = "HIGH";
      } else if (isOwned) {
        priorityLevel = "LOW";
      }

      const learningDifficulty: "EASY" | "MODERATE" | "CHALLENGING" =
        req.skillId === "skill-bms" || req.skillId === "skill-ros" ? "CHALLENGING" : "MODERATE";

      const sName = (req as any).skillName || (req as any).name || "Core Skill";
      const sLevel = (req as any).minProficiency || (req as any).level || "ADVANCED";
      const isMandatory = (req as any).isMandatory ?? true;

      const expectedImpact = isMandatory
        ? `Closing this critical gap increases job match score by +28% and unlocks 1,800+ OEM job requisitions.`
        : `Enhances multidisciplinary competence and competitive positioning in automated plants.`;

      results.push({
        skillId: req.skillId,
        skillName: sName,
        categoryName: "Technical Core",
        priorityLevel,
        priorityRank: rank++,
        currentProficiency: isOwned ? "INTERMEDIATE" : "NONE",
        targetProficiency: sLevel,
        reasons: {
          roleImportance: isMandatory ? "Mandatory Core Competency for Target Role" : "Highly Recommended Secondary Skill",
          annualMarketDemand: gap.annualEmployerDemand || 1850,
          demandGrowthYoY: 34.5,
          employerAdoptionRate: "High (82% of sector job postings require this competency)",
          learningDifficulty,
          expectedCareerImpact: expectedImpact,
        },
        recommendedNextAction: isOwned
          ? "Complete proctored assessment diagnostic to earn a Verified Skill Passport badge."
          : `Enroll in 60-hour hands-on lab course and submit capstone hardware project.`,
      });
    }

    // Sort by priority rank (CRITICAL -> HIGH -> MEDIUM -> LOW)
    const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    results.sort((a, b) => priorityWeight[b.priorityLevel] - priorityWeight[a.priorityLevel]);
    results.forEach((item, idx) => (item.priorityRank = idx + 1));

    return results;
  },
};
