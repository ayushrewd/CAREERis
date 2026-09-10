import { CareerTransitionAnalysis } from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { careerProjectRepository } from "@/server/repositories/careerProjectRepository";
import { employerRepository } from "@/server/repositories/employerRepository";

export const careerTransitionService = {
  async analyzeTransition(candidateId: string, toRoleId = "role-bms-lead"): Promise<CareerTransitionAnalysis> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const toRole = await roleRepository.findById(toRoleId);

    const toRoleTitle = toRole ? toRole.title : "Battery Management System (BMS) Calibration Specialist";
    const toIndustryName = (toRole as any)?.sector || toRole?.sectorId || "Automotive & EV Mobility";

    const candidateSkillIds = new Set((candidate.skills || []).map((s) => s.skillId));
    const targetSkills = toRole?.coreSkills || [
      { skillId: "skill-bms", name: "Battery Management Systems (BMS)", level: "ADVANCED" as const, isMandatory: true },
      { skillId: "skill-can", name: "CAN Bus Communication", level: "INTERMEDIATE" as const, isMandatory: true },
      { skillId: "skill-plc", name: "PLC Automation & SCADA", level: "INTERMEDIATE" as const, isMandatory: false },
    ];

    const transferableSkills: Array<{ skillId: string; skillName: string; proficiency: string }> = [];
    const missingSkills: Array<{ skillId: string; skillName: string; importance: string }> = [];

    for (const req of targetSkills) {
      const sName = (req as any).skillName || (req as any).name || "Core Skill";
      const match = (candidate.skills || []).find((cs) => cs.skillId === req.skillId || (cs.skillName && cs.skillName.toLowerCase() === sName.toLowerCase()));
      if (match) {
        transferableSkills.push({
          skillId: req.skillId,
          skillName: sName,
          proficiency: match.claimedProficiency || "INTERMEDIATE",
        });
      } else {
        missingSkills.push({
          skillId: req.skillId,
          skillName: sName,
          importance: (req as any).isMandatory ? "CRITICAL" : "HIGH",
        });
      }
    }

    // Courses & Projects
    const coursesRes = await courseRepository.findAll({ search: "BMS" });
    const recommendedCourses = coursesRes.items.slice(0, 2).map((c) => ({
      courseId: c.id,
      title: c.title,
      providerName: c.trainingProviderName,
      durationHours: c.durationHours || 320,
    }));

    const projectsRes = await careerProjectRepository.findAll({ targetRoleId: toRoleId });
    const recommendedProjects = projectsRes.map((p) => ({
      projectId: p.id,
      title: p.title,
      difficulty: p.difficulty,
    }));

    // Employers & Geography
    const companies = await employerRepository.findAll();
    const relevantEmployers = companies.slice(0, 3).map((c) => ({
      employerId: c.id,
      employerName: c.name,
      location: c.headquarters || "Pune, Maharashtra",
      activeJobsCount: c.activeJobsCount || 12,
    }));

    const relevantGeography = [
      { districtName: "Pune (Chakan EV Corridor)", stateCode: "MH", demandVolume: 1850 },
      { districtName: "Bengaluru Urban", stateCode: "KA", demandVolume: 1420 },
      { districtName: "Gautam Buddha Nagar (Noida)", stateCode: "UP", demandVolume: 980 },
    ];

    const transferableRatio = transferableSkills.length / Math.max(1, targetSkills.length);
    const projectedReadinessScore = Math.min(95, Math.round(transferableRatio * 50 + 45));

    return {
      fromRoleTitle: (candidate.experience && candidate.experience.length > 0) ? ((candidate.experience[0] as any).role || candidate.experience[0].jobTitle || "Technician") : "Mechanical / Electrical Technician",
      toRoleId,
      toRoleTitle,
      toIndustryName,
      transferableSkills,
      missingSkills,
      prerequisites: ["High-Voltage Safety Norms", "Digital Multimeter Operation"],
      estimatedTransitionMonths: missingSkills.length <= 1 ? 3 : 6,
      projectedReadinessScore,
      recommendedCourses,
      recommendedProjects,
      relevantEmployers,
      relevantGeography,
      confidence: 0.95,
    };
  },
};
