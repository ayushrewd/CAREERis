import { NextRequest } from "next/server";
import { governmentService } from "@/server/services/governmentService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  try {
    const list = await governmentService.getEmergingSkills();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch emerging skills", "FETCH_ERROR", 500);
  }
}
