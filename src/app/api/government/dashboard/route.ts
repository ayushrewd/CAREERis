import { NextRequest, NextResponse } from "next/server";
import { governmentCommandCenterService } from "@/server/services/government/governmentCommandCenterService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const data = await governmentCommandCenterService.getNationalCommandOverview(auth);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
