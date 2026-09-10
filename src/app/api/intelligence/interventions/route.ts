import { NextRequest, NextResponse } from "next/server";
import { interventionService } from "@/server/services/intelligence/decision/interventionService";
import { InterventionStatus } from "@/types/decisionIntelligence";

export async function GET(req: NextRequest) {
  try {
    const status = (req.nextUrl.searchParams.get("status") as InterventionStatus) || undefined;
    const districtId = req.nextUrl.searchParams.get("districtId") || undefined;
    const items = await interventionService.getAllInterventions({ status, districtId });
    return NextResponse.json({ success: true, data: items, total: items.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await interventionService.proposeIntervention(body);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
