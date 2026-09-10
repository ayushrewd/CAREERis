import { NextRequest } from "next/server";
import { auditRepository } from "@/server/repositories/auditRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || undefined;
    const entity = searchParams.get("entity") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const result = await auditRepository.findAll({ action, entity, page, pageSize });
    return successResponse(result.items, {
      pagination: {
        page,
        pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch audit logs", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLog = await auditRepository.record({
      userName: body.userName || "System User",
      userRole: body.userRole || "CANDIDATE",
      action: body.action || "GENERIC_API_ACTION",
      entity: body.entity || "ApiEntity",
      entityId: body.entityId,
      details: body.details,
    });
    return successResponse(newLog, { statusCode: 201 });
  } catch (error: any) {
    return errorResponse("Invalid audit event payload", "VALIDATION_ERROR", 400);
  }
}
