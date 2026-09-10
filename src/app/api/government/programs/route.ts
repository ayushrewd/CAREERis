import { NextRequest, NextResponse } from "next/server";
import { governmentProgramService } from "@/server/services/government/governmentProgramService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const schemeCode = searchParams.get("schemeCode") || undefined;
    const status = (searchParams.get("status") as any) || undefined;
    const search = searchParams.get("search") || undefined;

    const programs = await governmentProgramService.getPrograms({ stateCode, schemeCode, status, search });
    return NextResponse.json({ success: true, count: programs.length, data: programs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await governmentProgramService.createProgram(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
