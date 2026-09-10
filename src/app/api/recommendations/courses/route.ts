import { NextRequest } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { courseRecommendationService } from "@/server/services/skill/courseRecommendationService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const candidateId = auth.userId || "user-cand-01";
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("roleId") || "role-bms-lead";

    const recommendations = await courseRecommendationService.recommendCoursesForCandidate(candidateId, roleId);
    return successResponse(recommendations);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to generate course recommendations", "RECOMMENDATION_ERROR", 500);
  }
}
