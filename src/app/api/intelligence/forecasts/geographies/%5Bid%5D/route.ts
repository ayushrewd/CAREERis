import { NextRequest, NextResponse } from "next/server";
import { demandForecastService } from "@/server/services/intelligence/demandForecastService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const list = await demandForecastService.getForecasts({ entityId: params.id });
    const found = list[0] || (await demandForecastService.getNationalDemandForecast());
    return NextResponse.json({ success: true, data: found });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
