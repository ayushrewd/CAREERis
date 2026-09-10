import { NextRequest, NextResponse } from "next/server";
import { webhookService } from "@/server/services/ecosystem/webhookService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event || "CandidateShortlisted";
    const payload = body.payload || {};

    const deliveries = await webhookService.dispatchDomainEvent(event, payload);
    return NextResponse.json({ success: true, count: deliveries.length, data: deliveries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
