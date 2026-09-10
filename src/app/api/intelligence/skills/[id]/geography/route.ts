import { NextRequest } from "next/server";
import { crossGeographyAnalysisService } from "@/server/services/intelligence/crossGeographyAnalysisService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const geo = await crossGeographyAnalysisService.getSkillGeographicDistribution(params.id);
    return successResponse(geo);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill geography", "GEO_ERROR", 500);
  }
}
