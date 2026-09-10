import { NextRequest } from "next/server";
import { messageRepository } from "@/server/repositories/messageRepository";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { SendMessageSchema } from "@/server/validators/commonValidators";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = SendMessageSchema.safeParse({ ...body, conversationId: params.id });
    if (!parsed.success) {
      return errorResponse("Invalid message payload", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const msg = await messageRepository.sendMessage({
      conversationId: params.id,
      senderId: auth.userId,
      senderName: auth.fullName,
      senderRole: auth.userRole,
      recipientId: parsed.data.recipientId,
      recipientName: parsed.data.recipientName,
      content: parsed.data.content,
    });

    return successResponse(msg, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to send message", "SEND_ERROR", 500);
  }
}
