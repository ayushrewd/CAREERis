import { NextRequest, NextResponse } from "next/server";
import { interventionManagementService } from "@/server/services/government/interventionManagementService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const updated = await interventionManagementService.updateInterventionStatus(
      params.id,
      body.status,
      body.notes,
      body.actualValue,
      auth
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
