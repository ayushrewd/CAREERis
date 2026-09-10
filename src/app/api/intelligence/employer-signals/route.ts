import { NextRequest, NextResponse } from "next/server";
import { employerDemandValidationService } from "@/server/services/intelligence/decision/employerDemandValidationService";

export async function GET(req: NextRequest) {
  try {
    const employerId = req.nextUrl.searchParams.get("employerId") || undefined;
    const district = req.nextUrl.searchParams.get("district") || undefined;
    const skillId = req.nextUrl.searchParams.get("skillId") || undefined;

    const signals = await employerDemandValidationService.getAllSignals({ district, skillId });
    return NextResponse.json({ success: true, data: signals, total: signals.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await employerDemandValidationService.submitDemandSignal(body);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
