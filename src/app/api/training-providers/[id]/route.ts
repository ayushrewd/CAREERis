import { NextRequest } from "next/server";
import { courseService } from "@/server/services/courseService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await courseService.getProviderById(params.id);
    if (!provider) {
      return notFoundResponse(`Training provider ${params.id} not found`);
    }
    return successResponse(provider);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch training provider", "FETCH_ERROR", 500);
  }
}
