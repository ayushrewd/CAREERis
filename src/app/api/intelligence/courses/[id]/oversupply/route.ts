import { NextRequest, NextResponse } from "next/server";
import { courseOversupplyService } from "@/server/services/intelligence/decision/courseOversupplyService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const report = await courseOversupplyService.evaluateCourseOversupply(courseId);
    return NextResponse.json({ success: true, data: report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
