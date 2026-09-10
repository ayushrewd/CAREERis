import { NextRequest, NextResponse } from "next/server";
import { curriculumIntelligenceService } from "@/server/services/training/curriculumIntelligenceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const result = await curriculumIntelligenceService.submitEmployerFeedback(
      body.courseId || "course-bms-lead-01",
      body,
      auth
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
