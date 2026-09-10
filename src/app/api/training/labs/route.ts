import { NextRequest, NextResponse } from "next/server";
import { labEquipmentService } from "@/server/services/training/labEquipmentService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instituteId = searchParams.get("instituteId") || undefined;

    const labs = await labEquipmentService.getAllLabs({ instituteId });
    return NextResponse.json({ success: true, count: labs.length, data: labs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
