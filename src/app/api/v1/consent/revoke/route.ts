import { NextRequest, NextResponse } from "next/server";
import { consentService } from "@/server/services/ecosystem/consentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const consentId = body.consentId;

    if (!consentId) {
      return NextResponse.json({ success: false, error: "consentId is required" }, { status: 400 });
    }

    const revoked = await consentService.revokeConsent(consentId);
    return NextResponse.json({ success: true, data: revoked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
