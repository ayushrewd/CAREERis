import { NextRequest, NextResponse } from "next/server";
import { nationalPolicyIntelligenceService } from "@/server/services/government/nationalPolicyIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get("severity") || undefined;

    const alerts = await nationalPolicyIntelligenceService.getCriticalAlerts(severity);
    return NextResponse.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const alert = await nationalPolicyIntelligenceService.createGovernmentAlert({
      severity: body.severity,
      title: body.title,
      description: body.description,
      triggerType: body.triggerType,
      state: body.state,
      district: body.district,
      affectedSkills: body.affectedSkills,
      evidenceSource: body.evidenceSource,
    });

    return NextResponse.json({ success: true, data: alert });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
