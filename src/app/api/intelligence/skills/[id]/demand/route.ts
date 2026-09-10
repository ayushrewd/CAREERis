import { NextRequest } from "next/server";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const demand = await demandAggregationService.aggregateDemand({ skillId: params.id });
    return successResponse(demand);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill demand", "DEMAND_ERROR", 500);
  }
}
