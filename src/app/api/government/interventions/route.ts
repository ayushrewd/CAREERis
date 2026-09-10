import { NextRequest, NextResponse } from "next/server";
import { interventionManagementService } from "@/server/services/government/interventionManagementService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;
    const status = (searchParams.get("status") as any) || undefined;
    const programId = searchParams.get("programId") || undefined;

    const list = await interventionManagementService.getInterventions({ stateCode, districtId, status, programId });
    return NextResponse.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await interventionManagementService.proposeIntervention(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
