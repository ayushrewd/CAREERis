import { NextRequest, NextResponse } from "next/server";
import { instituteOperatingService } from "@/server/services/training/instituteOperatingService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") as any) || undefined;
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;
    const search = searchParams.get("search") || undefined;

    const institutes = await instituteOperatingService.getAllInstitutes({ type, stateCode, districtId, search });
    return NextResponse.json({ success: true, count: institutes.length, data: institutes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
