import { NextRequest, NextResponse } from "next/server";
import { roleForecastService } from "@/server/services/intelligence/roleForecastService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roleForecast = await roleForecastService.getRoleForecastById(params.id);
    if (!roleForecast) {
      return NextResponse.json({ success: false, error: "Role forecast not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: roleForecast });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
