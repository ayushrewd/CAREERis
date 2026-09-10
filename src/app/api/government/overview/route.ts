import { NextRequest } from "next/server";
import { governmentService } from "@/server/services/governmentService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = (searchParams.get("context")?.toUpperCase() || "INDIA") as "INDIA" | "MAHARASHTRA" | "PUNE";
    const metrics = await governmentService.getOverviewMetrics(context);
    return successResponse(metrics);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch government overview", "FETCH_ERROR", 500);
  }
}
