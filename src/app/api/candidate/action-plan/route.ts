import { NextRequest, NextResponse } from "next/server";
import { careerReadinessService } from "@/server/services/career/careerReadinessService";
import { skillPrioritizationService } from "@/server/services/career/skillPrioritizationService";
import { personalizedLearningService } from "@/server/services/career/personalizedLearningService";
import { employabilityScoreService } from "@/server/services/career/employabilityScoreService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const targetRoleId = request.nextUrl.searchParams.get("targetRoleId") || "role-bms-lead";

    const readiness = await careerReadinessService.evaluateReadiness(candidateId, targetRoleId);
    const prioritizedSkills = await skillPrioritizationService.getPrioritizedSkills(candidateId, targetRoleId);
    const learningPath = await personalizedLearningService.generatePersonalizedPath(candidateId, targetRoleId);
    const employability = await employabilityScoreService.calculateEmployabilityScore(candidateId);

    return NextResponse.json({
      success: true,
      data: {
        readiness,
        prioritizedSkills,
        learningPath,
        employability,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
