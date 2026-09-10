import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export const dynamic = "force-dynamic";

const publicIdentity = {
  id: true,
  fullName: true,
  roleType: true,
  avatarUrl: true,
  candidateProfile: { select: { headline: true, location: true } },
  employerAccount: { select: { companyName: true } },
  trainingProviderAccount: { select: { organizationName: true } },
  governmentPlannerProfile: { select: { departmentName: true } },
} as const;

async function acceptedConnectionIds(userId: string) {
  const links = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    select: { requesterId: true, recipientId: true },
  });
  return [...new Set(links.map((link) =>
    link.requesterId === userId ? link.recipientId : link.requesterId
  ))];
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const connectionIds = await acceptedConnectionIds(auth.userId);

    const [connections, conversations] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: connectionIds }, isActive: true },
        select: publicIdentity,
        orderBy: { fullName: "asc" },
      }),
      prisma.conversation.findMany({
        where: {
          participants: { some: { userId: auth.userId } },
          ...(connectionIds.length
            ? { AND: { participants: { some: { userId: { in: connectionIds } } } } }
            : { id: "__no_connection_conversation__" }),
        },
        orderBy: { createdAt: "desc" },
        include: {
          participants: { include: { user: { select: publicIdentity } } },
          messages: {
            orderBy: { createdAt: "asc" },
            include: { sender: { select: publicIdentity } },
          },
        },
      }),
    ]);

    return NextResponse.json(
      { connections, conversations },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load messages";
    return NextResponse.json(
      { error: message },
      { status: message === "Authentication required" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    let recipientId = typeof body.recipientId === "string" ? body.recipientId : "";
    let conversationId = typeof body.conversationId === "string" ? body.conversationId : "";

    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, participants: { some: { userId: auth.userId } } },
        select: { participants: { where: { userId: { not: auth.userId } }, select: { userId: true } } },
      });
      recipientId = conversation?.participants[0]?.userId || "";
      if (!recipientId) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (!recipientId || recipientId === auth.userId) {
      return NextResponse.json({ error: "Select an accepted connection" }, { status: 400 });
    }

    const connected = await prisma.connection.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: auth.userId, recipientId },
          { requesterId: recipientId, recipientId: auth.userId },
        ],
      },
      select: { id: true },
    });
    if (!connected) {
      return NextResponse.json(
        { error: "Messaging is available only between accepted connections." },
        { status: 403 }
      );
    }

    if (!conversationId) {
      const existing = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: auth.userId } } },
            { participants: { some: { userId: recipientId } } },
          ],
        },
        select: { id: true },
      });
      if (existing) conversationId = existing.id;
      else {
        const conversation = await prisma.conversation.create({
          data: { participants: { create: [{ userId: auth.userId }, { userId: recipientId }] } },
          select: { id: true },
        });
        conversationId = conversation.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: auth.userId,
        content: content.slice(0, 5000),
      },
    });

    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: "MESSAGE",
        title: "New message",
        message: `${auth.fullName} sent you a message.`,
        actionUrl: "/messages",
      },
    }).catch(() => undefined);

    return NextResponse.json({ message, conversationId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send message";
    return NextResponse.json(
      { error: message },
      { status: message === "Authentication required" ? 401 : 500 }
    );
  }
}
