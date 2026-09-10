import { NextRequest, NextResponse } from "next/server";
import { credentialService } from "@/server/services/ecosystem/credentialService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const { searchParams } = new URL(req.url);
    const holderId = searchParams.get("holderId") || auth.userId;

    const credentials = await credentialService.getCandidateCredentials(holderId);
    return NextResponse.json({ success: true, count: credentials.length, data: credentials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cred = await credentialService.issueCredential({
      credentialType: body.credentialType || "VOCATIONAL_CERTIFICATE",
      title: body.title,
      holderId: body.holderId,
      skillId: body.skillId,
      skillName: body.skillName,
      proficiencyLevel: body.proficiencyLevel || "EXPERT",
      issuerId: body.issuerId || "org-ssc-asdc",
      issuerName: body.issuerName || "Automotive Skills Development Council (ASDC)",
      issuerType: body.issuerType || "SECTOR_SKILL_COUNCIL",
      evidenceUri: body.evidenceUri,
    });

    return NextResponse.json({ success: true, data: cred });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
