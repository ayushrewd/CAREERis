import { NextRequest, NextResponse } from "next/server";
import { talentPoolService } from "@/server/services/employer/talentPoolService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const pools = await talentPoolService.getTalentPools(auth.userId);
    return NextResponse.json({ success: true, count: pools.length, data: pools });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPool = await talentPoolService.createTalentPool(body);
    return NextResponse.json({ success: true, data: newPool });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
