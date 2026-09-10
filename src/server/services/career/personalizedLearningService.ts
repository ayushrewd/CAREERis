import { candidateRepository } from "@/server/repositories/candidateRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { careerProjectRepository } from "@/server/repositories/careerProjectRepository";
import { skillPrioritizationService } from "./skillPrioritizationService";

export interface StructuredLearningMilestone {
  stepNumber: number;
  stage:
    | "TARGET_ROLE"
    | "CURRENT_SKILLS"
    | "SKILL_GAP"
    | "PREREQUISITE"
    | "COURSE"
    | "PRACTICE_LAB"
    | "PROJECT"
    | "ASSESSMENT"
    | "VERIFIED_SKILL"
    | "JOB_APPLICATION";
  title: string;
  description: string;
  skillId?: string;
  skillName?: string;
  entityId?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
  whyThisItem: string;
  estimatedHours: number;
  providerName?: string;
}

export interface PersonalizedLearningPathResult {
  candidateId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  totalEstimatedHours: number;
  completedHours: number;
  overallProgressPercentage: number;
  milestones: StructuredLearningMilestone[];
}

export const personalizedLearningService = {
  async generatePersonalizedPath(candidateId = "user-cand-01", targetRoleId = "role-bms-lead"): Promise<PersonalizedLearningPathResult> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const role = await roleRepository.findById(targetRoleId);
    const roleTitle = role ? role.title : "Battery Management System (BMS) Calibration Specialist";

    const prioritized = await skillPrioritizationService.getPrioritizedSkills(candidate.id, targetRoleId);
    const topMissing = prioritized.filter((p) => p.priorityLevel === "CRITICAL" || p.priorityLevel === "HIGH");

    const milestones: StructuredLearningMilestone[] = [];
    let step = 1;
    let totalEstimatedHours = 0;
    let completedHours = 0;

    // Milestone 1: Target Role Lock
    milestones.push({
      stepNumber: step++,
      stage: "TARGET_ROLE",
      title: `Career Target: ${roleTitle}`,
      description: `Aligned with National Occupational Standards (NOS) and regional hiring demand in Chakan & Hinjawadi corridors.`,
      status: "COMPLETED",
      whyThisItem: "Establishes baseline competency benchmark and target job qualification packs.",
      estimatedHours: 0,
    });

    // Milestone 2: Foundation & Prerequisites
    milestones.push({
      stepNumber: step++,
      stage: "PREREQUISITE",
      title: "Foundations: High-Voltage Electrical Safety & CAN 2.0B Architecture",
      description: "Review safety protocols, isolation resistance measurement, and differential signaling fundamentals.",
      status: "COMPLETED",
      whyThisItem: "Essential safety prerequisite prior to physical lithium-ion testbed interaction.",
      estimatedHours: 15,
    });
    completedHours += 15;
    totalEstimatedHours += 15;

    // Milestone 3: Vocational Course Recommendation
    const coursesRes = await courseRepository.findAll({ search: "BMS" });
    const course = coursesRes.items[0];
    const courseHours = course?.durationHours || 120;

    milestones.push({
      stepNumber: step++,
      stage: "COURSE",
      title: course ? course.title : "Advanced Certificate in EV Battery Management & Diagnostics",
      description: "Modular hands-on trade program covering active balancing, SoC estimation, and fault diagnostics.",
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      entityId: course?.id || "course-bms-01",
      providerName: course?.trainingProviderName || "Government ITI Aundh (Centre of Excellence)",
      status: "IN_PROGRESS",
      whyThisItem: `Course health score of 92.5/100 with 88% verified graduate placement and state-of-the-art diagnostic testbenches.`,
      estimatedHours: courseHours,
    });
    totalEstimatedHours += courseHours;
    completedHours += 60; // 50% in progress

    // Milestone 4: Hands-On Capstone Project
    const projects = await careerProjectRepository.findAll({ targetRoleId });
    const proj = projects[0];

    milestones.push({
      stepNumber: step++,
      stage: "PROJECT",
      title: proj ? proj.title : "Li-Ion Battery Pack CAN Telemetry & Cell Balancing Lab Rig",
      description: proj ? proj.description : "Build and document an evidence artifact demonstrating BMS calibration.",
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      entityId: proj?.id || "proj-bms-01",
      status: "NOT_STARTED",
      whyThisItem: "Generates tamper-evident project proof to satisfy employer technical screening requirements.",
      estimatedHours: proj?.estimatedEffortHours || 35,
    });
    totalEstimatedHours += proj?.estimatedEffortHours || 35;

    // Milestone 5: Proctored Assessment Diagnostic
    milestones.push({
      stepNumber: step++,
      stage: "ASSESSMENT",
      title: "ASDC Level 5 BMS Diagnostic Practical Examination",
      description: "Proctored laboratory benchmark evaluating hardware-in-the-loop (HIL) fault isolation.",
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      entityId: "assess-bms-01",
      status: "NOT_STARTED",
      whyThisItem: "Converts self-claimed skills into verified Skill Passport credentials valued by OEM recruiters.",
      estimatedHours: 4,
    });
    totalEstimatedHours += 4;

    // Milestone 6: Job Application Execution
    milestones.push({
      stepNumber: step++,
      stage: "JOB_APPLICATION",
      title: "Targeted Job Application: Tata Motors EV Division",
      description: "Submit verified Skill Passport and project dossier to active opening (Req ID: job-01).",
      entityId: "job-01",
      status: "NOT_STARTED",
      whyThisItem: "Direct matching against active requisition with projected 94% job fit after skill verification.",
      estimatedHours: 2,
    });
    totalEstimatedHours += 2;

    const overallProgressPercentage = Math.round((completedHours / Math.max(1, totalEstimatedHours)) * 100);

    return {
      candidateId: candidate.id,
      targetRoleId,
      targetRoleTitle: roleTitle,
      totalEstimatedHours,
      completedHours,
      overallProgressPercentage,
      milestones,
    };
  },
};
