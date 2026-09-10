import { NextRequest } from "next/server";
import { employerService } from "@/server/services/employerService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comp = await employerService.getCompanyById(params.id);
    if (!comp) {
      return notFoundResponse(`Employer ${params.id} not found`);
    }
    return successResponse(comp);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch employer", "FETCH_ERROR", 500);
  }
}
