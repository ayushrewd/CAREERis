import { NextRequest, NextResponse } from "next/server";
import { equipmentCapacityService } from "@/server/services/intelligence/decision/equipmentCapacityService";

export async function GET(req: NextRequest) {
  try {
    const district = req.nextUrl.searchParams.get("district") || undefined;
    const gaps = await equipmentCapacityService.getAllEquipmentGaps(district);
    return NextResponse.json({ success: true, data: gaps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
