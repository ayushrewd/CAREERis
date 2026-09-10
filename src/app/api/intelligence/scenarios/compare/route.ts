import { NextRequest, NextResponse } from "next/server";
import { scenarioSimulationService } from "@/server/services/intelligence/scenarioSimulationService";

export async function GET(req: NextRequest) {
  try {
    const comparison = await scenarioSimulationService.compareScenarios();
    return NextResponse.json({ success: true, data: comparison });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
