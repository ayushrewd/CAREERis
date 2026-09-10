import { NextRequest, NextResponse } from "next/server";
import { trainingRequestMarketplaceService } from "@/server/services/training/trainingRequestMarketplaceService";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updated = await trainingRequestMarketplaceService.submitProviderResponse(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Training request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
