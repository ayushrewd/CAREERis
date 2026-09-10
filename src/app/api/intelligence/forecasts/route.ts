import { NextRequest, NextResponse } from "next/server";
import { demandForecastService } from "@/server/services/intelligence/demandForecastService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || undefined;
    const entityId = searchParams.get("entityId") || undefined;

    const forecasts = await demandForecastService.getForecasts({ scope, entityId });
    return NextResponse.json({ success: true, count: forecasts.length, data: forecasts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
