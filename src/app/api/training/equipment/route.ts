import { NextRequest, NextResponse } from "next/server";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get("labId") || undefined;
    const instituteId = searchParams.get("instituteId") || undefined;

    const equipment = await labEquipmentService.getAllEquipment({ labId, instituteId });
    return NextResponse.json({ success: true, count: equipment.length, data: equipment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
