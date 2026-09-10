import { NextRequest } from "next/server";
import { courseService } from "@/server/services/courseService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  try {
    const list = await courseService.getProviders();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch training providers", "FETCH_ERROR", 500);
  }
}
