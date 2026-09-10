import { NextRequest, NextResponse } from "next/server";
import { programmeService } from "@/server/services/programme/programmeService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const toc = await programmeService.getTheoryOfChange(params.id);
    if (!toc) {
      return NextResponse.json({ success: false, error: "Programme not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: toc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
