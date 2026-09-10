import { NextRequest, NextResponse } from "next/server";
import { curriculumFutureFitService } from "@/server/services/intelligence/curriculumFutureFitService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || undefined;

    if (courseId) {
      const fit = await curriculumFutureFitService.getFutureFitEvaluation(courseId);
      return NextResponse.json({ success: true, data: fit });
    }

    const all = await curriculumFutureFitService.getAllFutureFitEvaluations();
    return NextResponse.json({ success: true, count: all.length, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
