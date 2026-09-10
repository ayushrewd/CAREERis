import { NextRequest } from "next/server";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;

    const gaps = await labourMarketGapService.getAllRegionalGaps({ stateCode, districtId });
    return successResponse(gaps);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skills intelligence", "INTELLIGENCE_ERROR", 500);
  }
}
