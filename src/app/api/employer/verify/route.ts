import { NextRequest, NextResponse } from "next/server";
import { employerProfileService } from "@/server/services/employer/employerProfileService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const employerId = body.employerId || "comp-tata-motors";
    const verified = await employerProfileService.verifyEmployer(employerId, {
      status: body.status || "VERIFIED",
      notes: body.notes,
      auth,
    });
    return NextResponse.json({ success: true, data: verified });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
