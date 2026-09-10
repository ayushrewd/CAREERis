import { NextRequest } from "next/server";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { skillTrendService } from "@/server/services/intelligence/skillTrendService";
import { marketTightnessService } from "@/server/services/intelligence/marketTightnessService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gap = await labourMarketGapService.calculateSkillGap(params.id);
    const trend = await skillTrendService.getSkillTrend(params.id);
    const tightness = await marketTightnessService.evaluateTightness(params.id);

    return successResponse({
      ...gap,
      trendMetrics: trend,
      tightnessAnalysis: tightness,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill intelligence", "INTELLIGENCE_ERROR", 500);
  }
}
