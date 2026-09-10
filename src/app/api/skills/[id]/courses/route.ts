import { NextRequest } from "next/server";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await skillGraphRepository.findById(params.id);
    if (!skill) {
      return notFoundResponse(`Skill ${params.id} not found`);
    }

    const courses = await courseRepository.findAll({ search: skill.name });
    return successResponse(courses.items);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch courses for skill", "FETCH_ERROR", 500);
  }
}
