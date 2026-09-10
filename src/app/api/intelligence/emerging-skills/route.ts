import { NextRequest, NextResponse } from "next/server";
import { skillPredictionService } from "@/server/services/intelligence/skillPredictionService";

export async function GET(req: NextRequest) {
  try {
    const [skills, bundles] = await Promise.all([
      skillPredictionService.getEmergingSkills(),
      skillPredictionService.getFutureSkillBundles(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        emergingSkills: skills,
        skillBundles: bundles,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
