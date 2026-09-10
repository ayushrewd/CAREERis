import { NextRequest, NextResponse } from "next/server";
import { stateIntelligenceService } from "@/server/services/government/stateIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const states = await stateIntelligenceService.getAllStates();
    return NextResponse.json({ success: true, count: states.length, data: states });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
