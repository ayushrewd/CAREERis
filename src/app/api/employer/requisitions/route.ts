import { NextRequest, NextResponse } from "next/server";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || undefined;
    const status = (searchParams.get("status") as any) || undefined;
    const district = searchParams.get("district") || undefined;
    const search = searchParams.get("search") || undefined;

    const res = await jobRequisitionService.getRequisitions({ employerId, status, district, search });
    return NextResponse.json({ success: true, ...res });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const created = await jobRequisitionService.createRequisition(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
