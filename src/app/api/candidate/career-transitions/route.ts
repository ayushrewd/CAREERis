import { NextRequest, NextResponse } from "next/server";
import { careerTrajectoryService } from "@/server/services/career/careerTrajectoryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currentRole = searchParams.get("currentRole") || "Manual Arc Welder";
    const targetRole = searchParams.get("targetRole") || "Robotic Welding Specialist";

    const transition = await careerTrajectoryService.analyzeCareerTransition(currentRole, targetRole);
    return NextResponse.json({ success: true, data: transition });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
