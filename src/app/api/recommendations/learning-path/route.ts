import { NextRequest } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { learningPathService } from "@/server/services/skill/learningPathService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const candidateId = auth.userId || "user-cand-01";
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("roleId") || "role-bms-lead";

    const path = await learningPathService.generateLearningPath(candidateId, roleId);
    return successResponse(path);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to generate learning path", "LEARNING_PATH_ERROR", 500);
  }
}
