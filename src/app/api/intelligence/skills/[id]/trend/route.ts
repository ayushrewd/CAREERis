import { NextRequest } from "next/server";
import { skillTrendService } from "@/server/services/intelligence/skillTrendService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trend = await skillTrendService.getSkillTrend(params.id);
    return successResponse(trend);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill trend", "TREND_ERROR", 500);
  }
}
