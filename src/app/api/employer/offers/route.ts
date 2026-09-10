import { NextRequest, NextResponse } from "next/server";
import { offerManagementService } from "@/server/services/employer/offerManagementService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || undefined;
    const candidateId = searchParams.get("candidateId") || undefined;
    const requisitionId = searchParams.get("requisitionId") || undefined;

    const offers = await offerManagementService.getOffers({ employerId, candidateId, requisitionId });
    return NextResponse.json({ success: true, count: offers.length, data: offers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await offerManagementService.createOffer(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
