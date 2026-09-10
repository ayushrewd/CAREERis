import { NextRequest, NextResponse } from "next/server";
import { equipmentCapacityService } from "@/server/services/intelligence/decision/equipmentCapacityService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gaps = await equipmentCapacityService.evaluateEquipmentGap(params.id);
    return NextResponse.json({ success: true, data: gaps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
