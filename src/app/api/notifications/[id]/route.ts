import { NextRequest } from "next/server";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await notificationRepository.markAsRead(params.id);
    if (!success) {
      return notFoundResponse(`Notification ${params.id} not found`);
    }
    return successResponse({ id: params.id, isRead: true });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to mark notification", "UPDATE_ERROR", 500);
  }
}
