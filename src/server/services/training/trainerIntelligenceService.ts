// ==============================================================================
// CAREERIS TRAINER INTELLIGENCE SERVICE
// Competency Profiles, Capacity Gaps, Workload Analytics & Retraining Pathways
// ==============================================================================

import { trainerRepository } from "@/server/repositories/trainerRepository";
import { TrainerRecord, TrainerQualificationStatus, TrainerWorkloadStatus } from "@/types/trainingEcosystem";

const CANONICAL_DETAILED_TRAINERS: TrainerRecord[] = [
  {
    id: "tr-suresh-01",
    trainerName: "Suresh Gaikwad",
    instituteId: "inst-iti-aundh-pune",
    instituteName: "Government ITI Aundh, Pune",
    email: "suresh.g@itiaundh.edu.in",
    phone: "+91 94220 12345",
    yearsOfExperience: 12,
    industryExperienceYears: 6,
    assignedCourseIds: ["course-bms-lead-01", "course-bms-01"],
    assignedCourseNames: ["High-Voltage Electric Powertrain & BMS Specialist"],
    competencies: [
      { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", proficiencyLevel: "EXPERT", certifiedBy: "ASDC Level 6", verifiedDate: "2025-06-15" },
      { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms", proficiencyLevel: "ADVANCED", certifiedBy: "DVET Master Trainer", verifiedDate: "2025-08-20" },
    ],
    qualificationStatus: "QUALIFIED",
    workloadStatus: "OPTIMAL",
    activeBatchesCount: 2,
    totalStudentsAssigned: 48,
    weeklyTeachingHours: 24,
    needsRetraining: false,
  },
  {
    id: "tr-mahesh-02",
    trainerName: "Mahesh Patil",
    instituteId: "inst-iti-aundh-pune",
    instituteName: "Government ITI Aundh, Pune",
    email: "mahesh.p@itiaundh.edu.in",
    phone: "+91 94220 67890",
    yearsOfExperience: 15,
    industryExperienceYears: 4,
    assignedCourseIds: ["course-legacy-welder-01"],
    assignedCourseNames: ["General Manual Metal Arc Welder"],
    competencies: [
      { skillId: "skill-manual-arc-weld", skillName: "Manual Shielded Metal Arc Welding", proficiencyLevel: "EXPERT", certifiedBy: "NCVT", verifiedDate: "2020-04-10" },
    ],
    qualificationStatus: "PARTIALLY_QUALIFIED",
    workloadStatus: "UNDERUTILIZED",
    activeBatchesCount: 1,
    totalStudentsAssigned: 18,
    weeklyTeachingHours: 14,
    needsRetraining: true,
    retrainingPathway: {
      targetSkillId: "skill-robotics-kinematics",
      targetSkillName: "Robotic Cell Kinematics & Spot Welding",
      targetModule: "mod-robotic-weld-01",
      recommendedProgram: "TNSDC / DVET Industry 4.0 Master Trainer Upskilling (4 Weeks)",
      durationWeeks: 4,
      assessmentCertification: "ASDC Robotic Welding Lead Trainer Credential",
    },
  },
  {
    id: "tr-kavita-03",
    trainerName: "Kavita Rao",
    instituteId: "inst-polytechnic-bengaluru",
    instituteName: "Government Polytechnic Bengaluru",
    email: "kavita.rao@gptbengaluru.edu.in",
    phone: "+91 80 2226 9988",
    yearsOfExperience: 8,
    industryExperienceYears: 5,
    assignedCourseIds: ["course-edge-ai-01"],
    assignedCourseNames: ["Industrial IoT & Edge AI Embedded Systems Diploma"],
    competencies: [
      { skillId: "skill-ai-edge", skillName: "Edge AI & Embedded Firmware", proficiencyLevel: "ADVANCED", certifiedBy: "NASSCOM FutureSkills", verifiedDate: "2025-09-12" },
      { skillId: "skill-embedded-rtos", skillName: "Automotive RTOS", proficiencyLevel: "INTERMEDIATE", certifiedBy: "ARM University Program", verifiedDate: "2025-10-05" },
    ],
    qualificationStatus: "QUALIFIED",
    workloadStatus: "HIGH_LOAD",
    activeBatchesCount: 3,
    totalStudentsAssigned: 75,
    weeklyTeachingHours: 32,
    needsRetraining: false,
  },
];

export const trainerIntelligenceService = {
  async getAllTrainers(params?: { instituteId?: string; qualificationStatus?: string }): Promise<TrainerRecord[]> {
    let list = [...CANONICAL_DETAILED_TRAINERS];
    if (params?.instituteId) {
      list = list.filter((t) => t.instituteId === params.instituteId);
    }
    if (params?.qualificationStatus) {
      list = list.filter((t) => t.qualificationStatus === params.qualificationStatus);
    }
    return list;
  },

  async getTrainerById(id: string): Promise<TrainerRecord | null> {
    const found = CANONICAL_DETAILED_TRAINERS.find((t) => t.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getTrainerCapacitySummary(instituteId?: string) {
    const trainers = await this.getAllTrainers({ instituteId });
    const qualifiedCount = trainers.filter((t) => t.qualificationStatus === "QUALIFIED").length;
    const retrainingCount = trainers.filter((t) => t.needsRetraining).length;
    const overloadedCount = trainers.filter((t) => t.workloadStatus === "HIGH_LOAD" || t.workloadStatus === "OVERLOADED").length;

    return {
      totalActiveTrainers: trainers.length,
      qualifiedInstructorsPercentage: Math.round((qualifiedCount / Math.max(1, trainers.length)) * 100),
      trainersRequiringRetraining: retrainingCount,
      overloadedTrainersCount: overloadedCount,
      averageWeeklyTeachingHours: 23.3,
      recommendedActions: [
        "Sponsor 12 manual welding instructors for 4-week Robotic Cell Master Trainer program.",
        "Recruit 2 adjunct Industry 4.0 Edge AI trainers in Bengaluru polytechnic wing.",
      ],
    };
  },

  async generateRetrainingPathway(trainerId: string) {
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) return null;

    return {
      trainerId: trainer.id,
      trainerName: trainer.trainerName,
      instituteName: trainer.instituteName,
      currentCompetencies: trainer.competencies,
      qualificationStatus: trainer.qualificationStatus,
      retrainingPathway: trainer.retrainingPathway || {
        targetSkillId: "skill-bms",
        targetSkillName: "Battery Management Systems (BMS)",
        targetModule: "High-Voltage Battery Diagnostics",
        recommendedProgram: "DVET National EV Master Trainer Cohort",
        durationWeeks: 4,
        assessmentCertification: "ASDC Level 6 EV Master Trainer",
      },
    };
  },
};
