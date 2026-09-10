import { NextRequest, NextResponse } from "next/server";
import { courseHealthIntelligenceService } from "@/server/services/training/courseHealthIntelligenceService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const health = await courseHealthIntelligenceService.evaluateCourseHealth(params.id);
    return NextResponse.json({ success: true, data: health });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
