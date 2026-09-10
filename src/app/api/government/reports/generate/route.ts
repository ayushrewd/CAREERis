import { NextRequest, NextResponse } from "next/server";
import { governmentReportService } from "@/server/services/government/governmentReportService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const report = await governmentReportService.generateReport(
      body.reportType || "DISTRICT_SKILL_GAP",
      { stateCode: body.stateCode, districtId: body.districtId },
      auth
    );

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
