import { NextRequest, NextResponse } from "next/server";
import { governmentProgramService } from "@/server/services/government/governmentProgramService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const program = await governmentProgramService.getProgramById(params.id);
    if (!program) {
      return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: program });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const updated = await governmentProgramService.updateProgramKPI(
      params.id,
      body.kpiId,
      body.currentValue,
      body.status,
      auth
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
