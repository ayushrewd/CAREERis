import { NextRequest, NextResponse } from "next/server";
import { programmeService } from "@/server/services/programme/programmeService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const programme = await programmeService.getProgrammeById(params.id);
    if (!programme) {
      return NextResponse.json({ success: false, error: "Programme not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: programme });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
