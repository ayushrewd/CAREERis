import { NextRequest, NextResponse } from "next/server";
import { schemeIntelligenceService } from "@/server/services/government/schemeIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const schemes = await schemeIntelligenceService.getSchemes();
    return NextResponse.json({ success: true, count: schemes.length, data: schemes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
