import { NextRequest, NextResponse } from "next/server";
import { talentMatchingAndTrainabilityService } from "@/server/services/employer/talentMatchingAndTrainabilityService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const candidates = await talentMatchingAndTrainabilityService.getMatchingCandidates(params.id);
    return NextResponse.json({ success: true, count: candidates.length, data: candidates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
