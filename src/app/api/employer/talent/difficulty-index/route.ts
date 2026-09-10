import { NextRequest, NextResponse } from "next/server";
import { talentIntelligenceService } from "@/server/services/employer/talentIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId") || "skill-bms";
    const district = searchParams.get("district") || "Pune";

    const index = await talentIntelligenceService.calculateHiringDifficulty({ skillId, district });
    return NextResponse.json({ success: true, data: index });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
