import { NextRequest, NextResponse } from "next/server";
import { courseHealthService } from "@/server/services/intelligence/decision/courseHealthService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const health = await courseHealthService.evaluateCourseHealth(courseId);
    return NextResponse.json({ success: true, data: health });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
