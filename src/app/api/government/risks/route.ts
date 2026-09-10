import { NextRequest, NextResponse } from "next/server";
import { districtRiskService } from "@/server/services/government/districtRiskService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const districtId = searchParams.get("districtId") || undefined;
    const stateCode = searchParams.get("stateCode") || undefined;
    const severity = searchParams.get("severity") || undefined;

    const risks = await districtRiskService.getDistrictRisks({ districtId, stateCode, severity });
    return NextResponse.json({ success: true, count: risks.length, data: risks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
