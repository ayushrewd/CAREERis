import { NextRequest, NextResponse } from "next/server";
import { courseObsolescenceService } from "@/server/services/intelligence/decision/courseObsolescenceService";

export async function GET(req: NextRequest) {
  try {
    const reports = await courseObsolescenceService.getAllObsolescenceReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
