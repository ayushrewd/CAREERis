import { NextRequest, NextResponse } from "next/server";
import { careerComparisonAndSimulationService } from "@/server/services/career/careerComparisonAndSimulationService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const comparison = await careerComparisonAndSimulationService.compareCareers(body.roleIds);
    return NextResponse.json({ success: true, data: comparison });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
