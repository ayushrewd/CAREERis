import { NextRequest } from "next/server";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { skillNormalizationService } from "@/server/services/skill/skillNormalizationService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const skillType = searchParams.get("skillType") || undefined;
    const isEmerging = searchParams.get("isEmerging") === "true" ? true : undefined;
    const isGreenSkill = searchParams.get("isGreenSkill") === "true" ? true : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const result = await skillGraphRepository.findAll({
      search,
      categoryId,
      skillType,
      isEmerging,
      isGreenSkill,
      page,
      pageSize,
    });

    return successResponse(result.items, {
      pagination: {
        page,
        pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skills", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "normalize") {
      const normRes = await skillNormalizationService.normalizeSkill(body.rawText, body.context);
      return successResponse(normRes);
    }

    const created = await skillGraphRepository.create({
      code: body.code || `SKILL-${Date.now().toString(36).toUpperCase()}`,
      name: body.name,
      canonicalName: body.name,
      normalizedName: body.name.toLowerCase().trim(),
      description: body.description || "",
      categoryId: body.categoryId || "cat-prog",
      categoryName: body.categoryName || "General Technical",
      subcategory: body.subcategory,
      skillType: body.skillType || "TECHNICAL",
      status: "ACTIVE",
      version: 1,
      isEmerging: body.isEmerging || false,
      isGreenSkill: body.isGreenSkill || false,
    });

    return successResponse(created, { statusCode: 201 });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to process skill request", "CREATE_ERROR", 400);
  }
}
