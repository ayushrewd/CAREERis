import { NextRequest, NextResponse } from "next/server";
import { interventionExecutionService } from "@/server/services/programme/interventionExecutionService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;

    const interventions = await interventionExecutionService.getAllInterventions({ stateCode, districtId });
    return NextResponse.json({ success: true, count: interventions.length, data: interventions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
