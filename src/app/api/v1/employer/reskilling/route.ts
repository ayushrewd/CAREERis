import { NextRequest, NextResponse } from "next/server";
import { reskillingAndTrainingService } from "@/server/services/employer/reskillingAndTrainingService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const pathways = await reskillingAndTrainingService.getReskillingPathways(auth.userId);
    return NextResponse.json({ success: true, count: pathways.length, data: pathways });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
