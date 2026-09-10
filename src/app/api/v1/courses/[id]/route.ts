import { NextRequest, NextResponse } from "next/server";
import { courseMarketplaceService } from "@/server/services/training/courseMarketplaceService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await courseMarketplaceService.getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
