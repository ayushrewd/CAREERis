import { NextRequest, NextResponse } from "next/server";
import { courseMarketplaceService } from "@/server/services/training/courseMarketplaceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district") || undefined;
    const isGreenSkill = searchParams.get("isGreenSkill") === "true" ? true : undefined;
    const query = searchParams.get("query") || undefined;

    const courses = await courseMarketplaceService.getCourses({ district, isGreenSkill, query });
    return NextResponse.json({ success: true, count: courses.length, data: courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
