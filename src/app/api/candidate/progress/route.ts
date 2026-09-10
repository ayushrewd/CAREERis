import { NextRequest, NextResponse } from "next/server";
import { careerProgressService } from "@/server/services/career/careerProgressService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "cand-rohit-01";
    const progress = await careerProgressService.getCareerProgress(candidateId);
    return NextResponse.json({ success: true, data: progress });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
