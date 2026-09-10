import { NextRequest, NextResponse } from "next/server";
import { apiKeyAndPartnerService } from "@/server/services/ecosystem/apiKeyAndPartnerService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || undefined;

    const keys = orgId
      ? await apiKeyAndPartnerService.getPartnerApiKeys(orgId)
      : await apiKeyAndPartnerService.getAllApiKeys();

    return NextResponse.json({ success: true, count: keys.length, data: keys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await apiKeyAndPartnerService.generateApiKey({
      partnerOrganizationId: body.partnerOrganizationId || "comp-tata-motors",
      partnerName: body.partnerName || "Partner Organization",
      scopes: body.scopes || ["jobs:read", "credentials:verify"],
      rateLimitPerMinute: body.rateLimitPerMinute || 120,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
