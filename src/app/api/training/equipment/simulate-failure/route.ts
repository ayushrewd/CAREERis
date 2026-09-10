import { NextRequest, NextResponse } from "next/server";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const simulation = await labEquipmentService.simulateEquipmentFailure(
      body.equipmentId || "eq-bms-test-rig-01"
    );
    return NextResponse.json({ success: true, data: simulation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
