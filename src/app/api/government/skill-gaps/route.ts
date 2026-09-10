import { NextRequest } from "next/server";
import { governmentService } from "@/server/services/governmentService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  try {
    const gaps = await governmentService.getSkillGaps();
    return successResponse(gaps);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill gaps", "FETCH_ERROR", 500);
  }
}
