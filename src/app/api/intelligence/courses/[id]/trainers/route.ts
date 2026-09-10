import { NextRequest, NextResponse } from "next/server";
import { trainerRepository } from "@/server/repositories/trainerRepository";
import { courseRepository } from "@/server/repositories/courseRepository";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await courseRepository.findCourseById(params.id);
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }
    const allTrainers = await trainerRepository.findAll();
    const assigned = allTrainers.filter((t) => t.assignedCourses.includes(course.id));
    return NextResponse.json({ success: true, data: assigned });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
