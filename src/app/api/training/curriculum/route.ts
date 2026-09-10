import { NextRequest, NextResponse } from "next/server";
import { curriculumIntelligenceService } from "@/server/services/training/curriculumIntelligenceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || "course-bms-lead-01";

    const modules = await curriculumIntelligenceService.getModulesByCourseId(courseId);
    return NextResponse.json({ success: true, count: modules.length, data: modules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await curriculumIntelligenceService.createOrUpdateModule(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
