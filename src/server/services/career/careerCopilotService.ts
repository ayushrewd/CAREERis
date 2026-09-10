import {
  CopilotChatQuery,
  CopilotChatResponse,
  ICareerAIProvider,
} from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { careerReadinessService } from "./careerReadinessService";
import { skillPrioritizationService } from "./skillPrioritizationService";
import { personalizedJobService } from "./personalizedJobService";
import { courseRepository } from "@/server/repositories/courseRepository";

export class DeterministicCareerAIProvider implements ICareerAIProvider {
  async processCareerQuery(query: CopilotChatQuery): Promise<CopilotChatResponse> {
    const candidate = await candidateRepository.findById(query.candidateId) || await candidateRepository.getProfile(query.candidateId);
    const targetRoleId = query.context?.activeGoalRoleId || "role-bms-lead";

    const readiness = await careerReadinessService.evaluateReadiness(candidate.id, targetRoleId);
    const prioritizedSkills = await skillPrioritizationService.getPrioritizedSkills(candidate.id, targetRoleId);
    const jobs = await personalizedJobService.getRecommendedJobs(candidate.id);
    const coursesRes = await courseRepository.findAll({ search: "BMS" });

    const msg = query.message.toLowerCase();

    // Query Category 1: What should I learn next? / Skills
    if (msg.includes("learn") || msg.includes("skill") || msg.includes("gap") || msg.includes("next")) {
      const topSkill = prioritizedSkills[0];
      return {
        answer: `Based on your target career as '${readiness.targetRoleTitle}', your highest priority skill to master next is **${topSkill.skillName}** (${topSkill.priorityLevel} Priority).`,
        reason: `${topSkill.reasons.roleImportance}. ${topSkill.reasons.expectedCareerImpact}`,
        supportingData: {
          relevantSkills: prioritizedSkills.slice(0, 3).map((s) => s.skillName),
          readinessScore: readiness.overallReadinessScore,
          marketDemandVolume: topSkill.reasons.annualMarketDemand,
          recommendedCourseTitles: coursesRes.items.slice(0, 2).map((c) => c.title),
        },
        suggestedNextActions: [
          `Enroll in '${coursesRes.items[0]?.title || "EV Battery Training Program"}' at Govt ITI Aundh`,
          "Complete hands-on Li-ion balancing capstone project",
          "Schedule ASDC Level 5 proctored diagnostic assessment",
        ],
        confidence: 0.96,
        limitations: "Guidance is grounded in live regional employer job openings and National Occupational Standards.",
        isGroundedInDeterministicData: true,
      };
    }

    // Query Category 2: Jobs / Hiring / Where to apply?
    if (msg.includes("job") || msg.includes("apply") || msg.includes("hiring") || msg.includes("company")) {
      const topJob = jobs[0];
      return {
        answer: `You currently have a **${topJob.matchScore}% Match Score** for **${topJob.jobTitle}** at **${topJob.companyName}** in ${topJob.district}.`,
        reason: `${topJob.whyYouMatch} ${topJob.whatIsMissing}`,
        supportingData: {
          relevantSkills: topJob.matchedSkills.map((s) => s.skillName),
          readinessScore: readiness.overallReadinessScore,
          matchingJobsCount: jobs.length,
        },
        suggestedNextActions: [
          `Submit application to '${topJob.companyName}' (${topJob.jobTitle})`,
          "Share verified Skill Passport with hiring manager",
          "Simulate match score improvement before applying",
        ],
        confidence: 0.95,
        limitations: "Job vacancies reflect live verified postings on CareerIS.",
        isGroundedInDeterministicData: true,
      };
    }

    // Query Category 3: Readiness / Why is readiness score low?
    if (msg.includes("readiness") || msg.includes("score") || msg.includes("why")) {
      return {
        answer: `Your overall career readiness is **${readiness.overallReadinessScore}%** (${readiness.readinessLevel.replace(/_/g, " ")}).`,
        reason: readiness.explanation,
        supportingData: {
          relevantSkills: readiness.gapItems.filter((g) => g.status === "MET").map((g) => g.skillName),
          readinessScore: readiness.overallReadinessScore,
        },
        suggestedNextActions: [
          "Verify remaining claimed skills with proctored diagnostic tests",
          "Complete capstone lab project to generate verified evidence",
        ],
        confidence: 0.96,
        limitations: "Readiness calculation combines skill coverage, verified evidence, and experience alignment.",
        isGroundedInDeterministicData: true,
      };
    }

    // Default Fallback
    return {
      answer: `Hello ${candidate.headline.split(" ")[0] || "there"}! I am your CareerIS AI Career Copilot. I analyze your profile against ${readiness.targetRoleTitle} requirements and live employer demand in ${candidate.currentDistrict}.`,
      reason: `You have ${readiness.overallReadinessScore}% career readiness with ${jobs.length} matching job opportunities available.`,
      supportingData: {
        relevantSkills: candidate.skills.map((s) => s.skillName),
        readinessScore: readiness.overallReadinessScore,
        matchingJobsCount: jobs.length,
      },
      suggestedNextActions: [
        "Ask 'What skill should I learn next?'",
        "Ask 'Which jobs fit my profile?'",
        "Ask 'How can I increase my match score?'",
      ],
      confidence: 0.95,
      limitations: "Grounded strictly in verified CareerIS skill graph and institutional data.",
      isGroundedInDeterministicData: true,
    };
  }
}

export const careerCopilotService = {
  provider: new DeterministicCareerAIProvider(),

  async chat(query: CopilotChatQuery): Promise<CopilotChatResponse> {
    return this.provider.processCareerQuery(query);
  },
};
