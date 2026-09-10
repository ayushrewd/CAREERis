import { NextRequest, NextResponse } from "next/server";
import { assessmentEngineService } from "@/server/services/training/assessmentEngineService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId") || undefined;

    const questions = await assessmentEngineService.getQuestions(skillId);
    return NextResponse.json({ success: true, count: questions.length, data: questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
