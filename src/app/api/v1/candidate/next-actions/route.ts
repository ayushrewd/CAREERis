import { NextRequest, NextResponse } from "next/server";
import { nextBestActionService } from "@/server/services/career/nextBestActionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const actions = await nextBestActionService.getRankedActions(auth.userId);
    return NextResponse.json({ success: true, count: actions.length, data: actions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
