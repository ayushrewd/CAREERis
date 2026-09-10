import { NextRequest } from "next/server";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gap = await labourMarketGapService.calculateSkillGap(params.id);
    return successResponse(gap);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill gap", "GAP_ERROR", 500);
  }
}
