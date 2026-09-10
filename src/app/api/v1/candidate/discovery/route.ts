import { NextRequest, NextResponse } from "next/server";
import { nationalCareerGuidanceService } from "@/server/services/career/nationalCareerGuidanceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const discoveries = await nationalCareerGuidanceService.getCareerDiscoveries(auth.userId);
    return NextResponse.json({ success: true, count: discoveries.length, data: discoveries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
