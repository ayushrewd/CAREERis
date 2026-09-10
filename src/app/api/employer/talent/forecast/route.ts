import { NextRequest, NextResponse } from "next/server";
import { talentForecastService } from "@/server/services/employer/talentForecastService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId") || "skill-bms";
    const stateCode = searchParams.get("stateCode") || "MH";

    const forecast = await talentForecastService.getTalentForecast({ skillId, stateCode });
    return NextResponse.json({ success: true, data: forecast });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
