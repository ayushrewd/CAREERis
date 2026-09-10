import { NextRequest, NextResponse } from "next/server";
import { careerTransitionService } from "@/server/services/career/careerTransitionService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const toRoleId = request.nextUrl.searchParams.get("toRoleId") || "role-bms-lead";

    const analysis = await careerTransitionService.analyzeTransition(candidateId, toRoleId);
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
