import { NextRequest, NextResponse } from "next/server";
import { curriculumIntelligenceService } from "@/server/services/training/curriculumIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || "course-bms-lead-01";

    const gap = await curriculumIntelligenceService.getCurriculumGapAnalysis(courseId);
    return NextResponse.json({ success: true, data: gap });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
