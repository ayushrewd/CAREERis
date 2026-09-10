import { NextRequest, NextResponse } from "next/server";
import { skillPredictionService } from "@/server/services/intelligence/skillPredictionService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId") || undefined;

    if (skillId) {
      const sub = await skillPredictionService.getSkillSubstitutionAnalysis(skillId);
      return NextResponse.json({ success: true, data: sub });
    }

    const risks = await skillPredictionService.getObsolescenceRisks();
    return NextResponse.json({ success: true, count: risks.length, data: risks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
