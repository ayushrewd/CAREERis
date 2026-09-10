import { NextRequest } from "next/server";
import { messageRepository } from "@/server/repositories/messageRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await messageRepository.getMessages(params.id);
    return successResponse(messages);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch messages", "FETCH_ERROR", 500);
  }
}
