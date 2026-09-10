import { NextRequest, NextResponse } from "next/server";
import { securityAuditService } from "@/server/services/security/securityAuditService";

export async function GET(req: NextRequest) {
  try {
    const events = await securityAuditService.getAuditTrail();
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
