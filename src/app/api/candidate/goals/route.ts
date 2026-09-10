import { NextRequest, NextResponse } from "next/server";
import { careerGoalService } from "@/server/services/career/careerGoalService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "cand-rohit-01";
    const goals = await careerGoalService.getGoals(candidateId);
    return NextResponse.json({ success: true, data: goals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await careerGoalService.addGoal(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
