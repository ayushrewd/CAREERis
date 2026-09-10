import { NextRequest, NextResponse } from "next/server";
import { courseOversupplyService } from "@/server/services/intelligence/decision/courseOversupplyService";

export async function GET(req: NextRequest) {
  try {
    const reports = await courseOversupplyService.getAllOversupplyReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
