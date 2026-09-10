import { NextRequest, NextResponse } from "next/server";
import { credentialService } from "@/server/services/ecosystem/credentialService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const share = await credentialService.generateShareLink(
      body.credentialId,
      body.candidateId || auth.userId,
      body.durationDays || 7
    );

    return NextResponse.json({ success: true, data: share });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
