import { NextRequest, NextResponse } from "next/server";
import { skillPredictionService } from "@/server/services/intelligence/skillPredictionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const forecast = await skillPredictionService.getSkillForecast(params.id);
    if (!forecast) {
      return NextResponse.json({ success: false, error: "Skill forecast not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: forecast });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
