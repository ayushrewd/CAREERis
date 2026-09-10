import { NextRequest, NextResponse } from "next/server";
import { trainerCapacityService } from "@/server/services/intelligence/decision/trainerCapacityService";

export async function GET(req: NextRequest) {
  try {
    const district = req.nextUrl.searchParams.get("district") || undefined;
    const gaps = await trainerCapacityService.getAllTrainerGaps(district);
    return NextResponse.json({ success: true, data: gaps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
