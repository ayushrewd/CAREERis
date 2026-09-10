import { NextRequest, NextResponse } from "next/server";
import { externalDataIngestionService } from "@/server/services/ecosystem/externalDataIngestionService";

export async function GET(req: NextRequest) {
  try {
    const connectors = await externalDataIngestionService.getAllConnectors();
    return NextResponse.json({ success: true, count: connectors.length, data: connectors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
