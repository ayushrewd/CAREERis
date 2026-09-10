import { NextRequest, NextResponse } from "next/server";
import { curriculumIntelligenceService } from "@/server/services/intelligence/decision/curriculumIntelligenceService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const curriculum = await curriculumIntelligenceService.getCourseCurriculum(courseId);
    return NextResponse.json({ success: true, data: curriculum });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
