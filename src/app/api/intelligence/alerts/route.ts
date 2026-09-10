import { NextRequest, NextResponse } from "next/server";
import { predictiveRiskAlertService } from "@/server/services/intelligence/predictiveRiskAlertService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metricId = searchParams.get("metricId") || undefined;

    if (metricId) {
      const explanation = await predictiveRiskAlertService.explainForecastDriver(metricId);
      return NextResponse.json({ success: true, data: explanation });
    }

    const alerts = await predictiveRiskAlertService.getAllAlerts();
    return NextResponse.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
