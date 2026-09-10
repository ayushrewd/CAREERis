import { NextRequest, NextResponse } from "next/server";
import { curriculumIntelligenceService } from "@/server/services/intelligence/decision/curriculumIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const gaps = await curriculumIntelligenceService.getAllCurriculumGaps();
    return NextResponse.json({ success: true, data: gaps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
