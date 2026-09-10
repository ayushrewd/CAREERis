import { NextRequest, NextResponse } from "next/server";
import { credentialService } from "@/server/services/ecosystem/credentialService";
import { securityAuditService } from "@/server/services/security/securityAuditService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await credentialService.verifyPublicCredential(params.id);

    // Audit verification event
    await securityAuditService.logEvent({
      eventType: "CREDENTIAL_VERIFIED",
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      resourceAccessed: `/api/v1/credentials/verify/${params.id}`,
      status: result.isValid ? "SUCCESS" : "ANOMALY_DETECTED",
      details: `Public verification requested for credential ${params.id}.`,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
