import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Partial<PaginationMeta> & Record<string, any>;
  isDemoData?: boolean;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  requestId: string;
  details?: any;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export function generateRequestId(): string {
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function successResponse<T>(
  data: T,
  meta?: Partial<PaginationMeta> & Record<string, any>,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  const isDemo = process.env.DATABASE_MODE === "demo" || !process.env.DATABASE_URL;
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
      ...(isDemo ? { isDemoData: true } : {}),
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  code = "BAD_REQUEST",
  status = 400,
  details?: any
): NextResponse<ApiErrorResponse> {
  const requestId = generateRequestId();
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        requestId,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}

export function unauthorizedResponse(message = "Unauthorized access"): NextResponse<ApiErrorResponse> {
  return errorResponse(message, "UNAUTHORIZED", 401);
}

export function forbiddenResponse(message = "Insufficient permissions"): NextResponse<ApiErrorResponse> {
  return errorResponse(message, "FORBIDDEN", 403);
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiErrorResponse> {
  return errorResponse(message, "NOT_FOUND", 404);
}
