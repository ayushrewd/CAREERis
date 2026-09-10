import { NextRequest, NextResponse } from "next/server";
import { talentIntelligenceService } from "@/server/services/employer/talentIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = (searchParams.get("scope") as any) || undefined;
    const skillId = searchParams.get("skillId") || undefined;

    const data = await talentIntelligenceService.getTalentAvailabilityMap({ scope, skillId });
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
