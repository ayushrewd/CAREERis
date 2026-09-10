import { NextRequest } from "next/server";
import { messageRepository } from "@/server/repositories/messageRepository";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const conversations = await messageRepository.getConversations(auth.userId);
    return successResponse(conversations);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch conversations", "FETCH_ERROR", 500);
  }
}
