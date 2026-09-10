import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export const dynamic = "force-dynamic";

const publicUser = {
  id: true,
  fullName: true,
  roleType: true,
  avatarUrl: true,
  candidateProfile: { select: { headline: true, location: true } },
  employerAccount: { select: { companyName: true } },
  trainingProviderAccount: { select: { organizationName: true } },
} as const;

const excludedSeedAccounts = [
  { email: { endsWith: "@careeris.in", mode: "insensitive" as const } },
  { email: { endsWith: ".invalid", mode: "insensitive" as const } },
];

function identityKey(user: {
  fullName: string;
  roleType: string;
  employerAccount?: { companyName: string } | null;
  trainingProviderAccount?: { organizationName: string } | null;
}) {
  const name = user.employerAccount?.companyName ||
    user.trainingProviderAccount?.organizationName ||
    user.fullName;
  return `${user.roleType}:${name.trim().toLocaleLowerCase()}`;
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const records = await prisma.connection.findMany({
      where: {
        OR: [{ requesterId: auth.userId }, { recipientId: auth.userId }],
      },
      include: {
        requester: { select: publicUser },
        recipient: { select: publicUser },
      },
      orderBy: { createdAt: "desc" },
    });

    const involved = new Set([
      auth.userId,
      ...records.flatMap((x) => [x.requesterId, x.recipientId]),
    ]);

    const suggestionCandidates = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(involved) },
        isActive: true,
        NOT: excludedSeedAccounts,
      },
      take: 100,
      orderBy: { createdAt: "desc" },
      select: publicUser,
    });

    const connectedIdentityKeys = new Set(
      records.map((record) => identityKey(
        record.requesterId === auth.userId ? record.recipient : record.requester
      ))
    );
    const seenSuggestionKeys = new Set<string>();
    const suggestions = suggestionCandidates.filter((user) => {
      const key = identityKey(user);
      if (connectedIdentityKeys.has(key) || seenSuggestionKeys.has(key)) return false;
      seenSuggestionKeys.add(key);
      return true;
    }).slice(0, 20);

    return NextResponse.json({
      connections: records
        .filter((x) => x.status === "ACCEPTED")
        .map((x) => (x.requesterId === auth.userId ? x.recipient : x.requester)),
      incoming: records
        .filter((x) => x.status === "PENDING" && x.recipientId === auth.userId)
        .map((x) => ({ requestId: x.id, user: x.requester })),
      outgoing: records
        .filter((x) => x.status === "PENDING" && x.requesterId === auth.userId)
        .map((x) => x.recipient),
      suggestions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load network";
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

    if (body.action === "REQUEST") {
      const targetUserId = body.userId || body.targetUserId;
      if (!targetUserId) {
        return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
      }
      if (targetUserId === auth.userId) {
        return NextResponse.json({ error: "Cannot connect to yourself" }, { status: 400 });
      }

      // Check if already connected or pending in either direction
      const existing = await prisma.connection.findFirst({
        where: {
          OR: [
            { requesterId: auth.userId, recipientId: targetUserId },
            { requesterId: targetUserId, recipientId: auth.userId },
          ],
        },
      });

      if (existing) {
        if (existing.status === "ACCEPTED") {
          return NextResponse.json({ error: "You are already connected" }, { status: 409 });
        }
        return NextResponse.json(
          { error: "A connection request is already pending between you" },
          { status: 409 }
        );
      }

      const connection = await prisma.connection.create({
        data: {
          requesterId: auth.userId,
          recipientId: targetUserId,
          status: "PENDING",
        },
      });

      // Fetch requester's identity to create a personalized notification
      const requester = await prisma.user.findUnique({
        where: { id: auth.userId },
        include: {
          employerAccount: { select: { companyName: true } },
          trainingProviderAccount: { select: { organizationName: true } },
        },
      });

      const senderName =
        requester?.employerAccount?.companyName ||
        requester?.trainingProviderAccount?.organizationName ||
        requester?.fullName ||
        "A member";

      // Create notification record for recipient
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "MESSAGE",
          title: `New Connection Request`,
          message: `${senderName} sent you a connection request.`,
          actionUrl: "/employers",
        },
      }).catch((e) => console.error("Failed to create connection notification", e));

      return NextResponse.json({ connection }, { status: 201 });
    }

    if (body.action === "ACCEPT") {
      const requestId = body.requestId;
      if (!requestId) {
        return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
      }

      const existing = await prisma.connection.findFirst({
        where: {
          id: requestId,
          recipientId: auth.userId,
          status: "PENDING",
        },
        include: {
          recipient: { select: { fullName: true } },
        },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Connection request not found or already accepted" },
          { status: 404 }
        );
      }

      await prisma.connection.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      // Notify requester that their connection request was accepted
      await prisma.notification.create({
        data: {
          userId: existing.requesterId,
          type: "MESSAGE",
          title: "Connection Request Accepted",
          message: `${existing.recipient.fullName} accepted your connection request!`,
          actionUrl: "/employers",
        },
      }).catch((e) => console.error("Failed to notify requester", e));

      return NextResponse.json({ accepted: true });
    }

    if (body.action === "DECLINE" || body.action === "IGNORE") {
      const requestId = body.requestId;
      if (!requestId) {
        return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
      }

      await prisma.connection.deleteMany({
        where: {
          id: requestId,
          recipientId: auth.userId,
          status: "PENDING",
        },
      });

      return NextResponse.json({ declined: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update network";
    return NextResponse.json(
      { error: message },
      { status: message === "Authentication required" ? 401 : 500 }
    );
  }
}
