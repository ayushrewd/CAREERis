import { NextRequest, NextResponse } from "next/server";
import { nationalPolicyIntelligenceService } from "@/server/services/government/nationalPolicyIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const data = await nationalPolicyIntelligenceService.getNationalIntelligence();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
