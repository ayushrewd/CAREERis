import { NextRequest } from "next/server";
import { CANONICAL_INDUSTRIES } from "@/data/canonicalIndustriesData";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const industry = CANONICAL_INDUSTRIES.find(
      (i) => i.id.toLowerCase() === params.id.toLowerCase() || i.code.toLowerCase() === params.id.toLowerCase()
    );

    if (!industry) {
      return notFoundResponse(`Industry ${params.id} not found`);
    }

    const demandSummary = await demandAggregationService.aggregateDemand({ industryId: industry.id });

    return successResponse({
      industry,
      demandSummary,
      confidence: 0.94,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch industry intelligence", "INDUSTRY_ERROR", 500);
  }
}
