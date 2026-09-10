import { NextRequest, NextResponse } from "next/server";
import { trainingPartnershipService } from "@/server/services/employer/trainingPartnershipService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || undefined;
    const trainingProviderId = searchParams.get("trainingProviderId") || undefined;
    const status = (searchParams.get("status") as any) || undefined;

    const partnerships = await trainingPartnershipService.getPartnerships({ employerId, trainingProviderId, status });
    return NextResponse.json({ success: true, count: partnerships.length, data: partnerships });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await trainingPartnershipService.createPartnership(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
