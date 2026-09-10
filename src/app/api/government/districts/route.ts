import { NextRequest } from "next/server";
import { geographyRepository } from "@/server/repositories/geographyRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get("stateId") || undefined;
    const stateCode = searchParams.get("stateCode") || undefined;
    const districts = await geographyRepository.getAllDistricts({ stateId, stateCode });
    return successResponse(districts);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch districts", "FETCH_ERROR", 500);
  }
}
