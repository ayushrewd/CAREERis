import { NextRequest, NextResponse } from "next/server";
import { skillFirstRequisitionService } from "@/server/services/employer/skillFirstRequisitionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reqItem = await skillFirstRequisitionService.getRequisitionById(params.id);
    if (!reqItem) {
      return NextResponse.json({ success: false, error: "Requisition not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: reqItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
