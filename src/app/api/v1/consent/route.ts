import { NextRequest, NextResponse } from "next/server";
import { consentService } from "@/server/services/ecosystem/consentService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId") || auth.userId;

    const consents = await consentService.getCandidateConsents(candidateId);
    return NextResponse.json({ success: true, count: consents.length, data: consents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const grant = await consentService.grantConsent({
      candidateId: body.candidateId || auth.userId,
      granteeId: body.granteeId,
      granteeName: body.granteeName,
      granteeType: body.granteeType || "EMPLOYER",
      purpose: body.purpose || "APPLICATION_SHARING",
      dataScope: body.dataScope || ["skills", "assessments"],
      durationDays: body.durationDays,
    });

    return NextResponse.json({ success: true, data: grant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
