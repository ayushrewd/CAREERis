import { NextRequest } from "next/server";
import { employerService } from "@/server/services/employerService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const list = await employerService.getCompanies();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch employers", "FETCH_ERROR", 500);
  }
}
