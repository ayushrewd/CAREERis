import { NextRequest, NextResponse } from "next/server";
import { districtActionService } from "@/server/services/intelligence/decision/districtActionService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const districtId = params.id;
    const plan = await districtActionService.generateDistrictProfile(districtId);
    return NextResponse.json({ success: true, data: plan });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
