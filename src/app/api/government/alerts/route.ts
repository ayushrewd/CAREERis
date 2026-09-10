import { NextRequest, NextResponse } from "next/server";
import { districtRiskService } from "@/server/services/government/districtRiskService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const severity = searchParams.get("severity") || undefined;

    const alerts = await districtRiskService.getEarlyWarningAlerts({ stateCode, severity });
    return NextResponse.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
