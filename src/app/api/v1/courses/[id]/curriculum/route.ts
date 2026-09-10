import { NextRequest, NextResponse } from "next/server";
import { curriculumVersionService } from "@/server/services/training/curriculumVersionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const curriculum = await curriculumVersionService.getCurriculumByCourseId(params.id);
    if (!curriculum) {
      return NextResponse.json({ success: false, error: "Curriculum not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: curriculum });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
