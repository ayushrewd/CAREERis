import { NextRequest, NextResponse } from "next/server";
import { instituteOperatingService } from "@/server/services/training/instituteOperatingService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scorecard = await instituteOperatingService.getInstituteScorecard(params.id);
    if (!scorecard) {
      return NextResponse.json({ success: false, error: "Institute not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: scorecard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
