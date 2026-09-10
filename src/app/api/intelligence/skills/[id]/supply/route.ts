import { NextRequest } from "next/server";
import { supplyAggregationService } from "@/server/services/intelligence/supplyAggregationService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supply = await supplyAggregationService.getSupplyBySkill(params.id);
    return successResponse(supply);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill supply", "SUPPLY_ERROR", 500);
  }
}
