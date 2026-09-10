import { NextRequest } from "next/server";
import { geographyRepository } from "@/server/repositories/geographyRepository";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const state = await geographyRepository.findStateByCode(params.id);
    if (!state) {
      return notFoundResponse(`State ${params.id} not found`);
    }

    const demandSummary = await demandAggregationService.aggregateDemand({ stateCode: state.code });
    const topGaps = await labourMarketGapService.getAllRegionalGaps({ stateCode: state.code });
    const districts = await geographyRepository.findDistrictsByState(state.code);

    return successResponse({
      state,
      demandSummary,
      topGaps: topGaps.slice(0, 6),
      districtsCount: districts.length,
      districts: districts.map((d) => ({ id: d.id, name: d.name, headquarters: d.headquarters })),
      confidence: 0.95,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch state intelligence", "STATE_ERROR", 500);
  }
}
