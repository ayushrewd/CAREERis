import { skillGapService } from "./skillGapService";
import { courseRepository } from "@/server/repositories/courseRepository";
import { assessmentRepository } from "@/server/repositories/assessmentRepository";
import { RecommendedLearningPath, RecommendedLearningStep } from "@/types/skills";

export const learningPathService = {
  async generateLearningPath(candidateId: string, targetRoleId: string): Promise<RecommendedLearningPath> {
    const gapAnalysis = await skillGapService.analyzeCandidateVsRole(candidateId, targetRoleId);
    const unMetGaps = gapAnalysis.gapItems.filter((g) => g.gapStatus !== "MET");

    const steps: RecommendedLearningStep[] = [];
    let stepNumber = 1;
    let totalEstimatedHours = 0;
    const skillsCovered: string[] = [];

    for (const gap of unMetGaps) {
      skillsCovered.push(gap.skillName);

      // Step A: Prerequisites (if any)
      if (gap.prerequisites.length > 0) {
        steps.push({
          stepNumber: stepNumber++,
          type: "PREREQUISITE",
          skillId: gap.skillId,
          skillName: gap.prerequisites[0],
          targetProficiency: "INTERMEDIATE",
          title: `Foundation: ${gap.prerequisites[0]} Fundamentals`,
          description: `Complete introductory review of ${gap.prerequisites[0]} before advancing to ${gap.skillName}.`,
          estimatedHours: 20,
        });
        totalEstimatedHours += 20;
      }

      // Step B: Vocational Course / Lab Modules
      const coursesRes = await courseRepository.findAll({ search: gap.skillName });
      const course = coursesRes.items[0];

      steps.push({
        stepNumber: stepNumber++,
        type: "COURSE",
        skillId: gap.skillId,
        skillName: gap.skillName,
        targetProficiency: gap.requiredProficiency,
        title: course ? course.title : `${gap.skillName} Industry Training Program`,
        description: course ? course.description : `Hands-on modular practical curriculum for ${gap.skillName}.`,
        estimatedHours: 60,
        entityId: course?.id,
        providerName: course?.trainingProviderName || "Govt ITI Aundh Skill Lab",
      });
      totalEstimatedHours += 60;

      // Step C: Practical Project Application
      steps.push({
        stepNumber: stepNumber++,
        type: "PROJECT",
        skillId: gap.skillId,
        skillName: gap.skillName,
        targetProficiency: gap.requiredProficiency,
        title: `Industry Capstone: ${gap.skillName} Implementation`,
        description: `Build and document an evidence artifact demonstrating ${gap.skillName} calibration / execution on hardware benches.`,
        estimatedHours: 30,
      });
      totalEstimatedHours += 30;

      // Step D: Proctored Diagnostic Assessment & Verification
      const asmts = await assessmentRepository.findBySkillId(gap.skillId);
      const asmt = asmts && asmts.length > 0 ? asmts[0] : null;

      steps.push({
        stepNumber: stepNumber++,
        type: "ASSESSMENT",
        skillId: gap.skillId,
        skillName: gap.skillName,
        targetProficiency: gap.requiredProficiency,
        title: asmt ? asmt.title : `Standardized Assessment: ${gap.skillName}`,
        description: `Complete the proctored test to earn an officially verified Skill Passport credential badge.`,
        estimatedHours: 2,
        entityId: asmt?.id,
      });
      totalEstimatedHours += 2;
    }

    return {
      candidateId,
      targetRoleId: gapAnalysis.targetRoleId,
      targetRoleTitle: gapAnalysis.targetRoleTitle,
      totalEstimatedHours,
      skillsCovered,
      steps,
    };
  },
};
