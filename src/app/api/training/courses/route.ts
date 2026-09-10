import { NextRequest, NextResponse } from "next/server";
import { courseHealthIntelligenceService } from "@/server/services/training/courseHealthIntelligenceService";
import { courseRepository } from "@/server/repositories/courseRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const providerId = searchParams.get("providerId") || undefined;

    const courses = await courseRepository.findAllCourses({ search, providerId });
    return NextResponse.json({ success: true, count: courses.total, data: courses.items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
