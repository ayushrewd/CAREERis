import { NextRequest, NextResponse } from "next/server";
import { offerManagementService } from "@/server/services/employer/offerManagementService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const updated = await offerManagementService.respondToOffer(params.id, {
      status: body.status,
      rejectionReason: body.rejectionReason,
      auth,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
