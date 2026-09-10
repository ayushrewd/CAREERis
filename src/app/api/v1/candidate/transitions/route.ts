import { NextRequest, NextResponse } from "next/server";
import { nationalCareerGuidanceService } from "@/server/services/career/nationalCareerGuidanceService";

export async function GET(req: NextRequest) {
  try {
    const transitions = await nationalCareerGuidanceService.getCareerTransitions();
    return NextResponse.json({ success: true, count: transitions.length, data: transitions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
