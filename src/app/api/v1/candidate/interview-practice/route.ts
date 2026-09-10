import { NextRequest, NextResponse } from "next/server";
import { interviewSimulationService } from "@/server/services/career/interviewSimulationService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleTarget = searchParams.get("roleTarget") || undefined;

    const questions = await interviewSimulationService.getQuestions(roleTarget);
    return NextResponse.json({ success: true, count: questions.length, data: questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
