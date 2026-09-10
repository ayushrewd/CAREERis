import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { successResponse, forbiddenResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const result = await skillGraphRepository.findAll({ search, categoryId, page, pageSize });
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
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to register canonical skills");
    }

    const body = await request.json();
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
    return errorResponse(err?.message || "Failed to create skill", "CREATE_ERROR", 400);
  }
}
