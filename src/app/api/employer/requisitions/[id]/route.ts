import { NextRequest, NextResponse } from "next/server";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requisition = await jobRequisitionService.getRequisitionById(params.id);
    if (!requisition) {
      return NextResponse.json({ success: false, error: "Requisition not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: requisition });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    if (body.status) {
      const updated = await jobRequisitionService.updateStatus(params.id, body.status, body.comments, auth);
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = await jobRequisitionService.updateRequisition(params.id, body, auth);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
