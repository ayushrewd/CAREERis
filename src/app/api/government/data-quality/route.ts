import { NextRequest, NextResponse } from "next/server";
import { districtRiskService } from "@/server/services/government/districtRiskService";

export async function GET(req: NextRequest) {
  try {
    const scorecard = await districtRiskService.getDataQualityScorecard();
    return NextResponse.json({ success: true, data: scorecard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
