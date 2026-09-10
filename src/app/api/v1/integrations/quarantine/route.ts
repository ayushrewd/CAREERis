import { NextRequest, NextResponse } from "next/server";
import { externalDataIngestionService } from "@/server/services/ecosystem/externalDataIngestionService";

export async function GET(req: NextRequest) {
  try {
    const records = await externalDataIngestionService.getQuarantineRecords();
    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordId, status } = body;

    if (!recordId || !status) {
      return NextResponse.json({ success: false, error: "recordId and status are required" }, { status: 400 });
    }

    const resolved = await externalDataIngestionService.resolveQuarantine(recordId, status);
    return NextResponse.json({ success: true, data: resolved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
