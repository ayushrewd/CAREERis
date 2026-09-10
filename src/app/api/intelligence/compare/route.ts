import { NextRequest } from "next/server";
import { intelligenceComparisonService } from "@/server/services/intelligence/intelligenceComparisonService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") || "SKILL_VS_SKILL") as any;
    const idA = searchParams.get("idA") || "skill-bms";
    const idB = searchParams.get("idB") || "skill-plc";
    const period = searchParams.get("period") || "2026-Q2";

    const comparison = await intelligenceComparisonService.compareEntities({
      type,
      idA,
      idB,
      period,
    });

    return successResponse(comparison);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to execute comparison", "COMPARE_ERROR", 400);
  }
}
