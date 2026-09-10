import { NextRequest, NextResponse } from "next/server";
import { programmeService } from "@/server/services/programme/programmeService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const status = (searchParams.get("status") as any) || undefined;

    const programmes = await programmeService.getProgrammes({ stateCode, status });
    return NextResponse.json({ success: true, count: programmes.length, data: programmes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
