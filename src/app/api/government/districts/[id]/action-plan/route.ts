import { NextRequest, NextResponse } from "next/server";
import { districtActionCenterService } from "@/server/services/government/districtActionCenterService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dossier = await districtActionCenterService.getDistrictActionDossier(params.id);
    return NextResponse.json({ success: true, data: dossier });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
