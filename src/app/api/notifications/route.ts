import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { notificationRepository } from "@/server/repositories/notificationRepository";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { NotificationItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);

    // 1. Fetch live pending incoming connection requests for this user
    const pendingConnections = await prisma.connection.findMany({
      where: {
        recipientId: auth.userId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            roleType: true,
            avatarUrl: true,
            candidateProfile: { select: { headline: true } },
            employerAccount: { select: { companyName: true } },
            trainingProviderAccount: { select: { organizationName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const connectionNotifications: NotificationItem[] = pendingConnections.map((c) => {
      const requesterName =
        c.requester.employerAccount?.companyName ||
        c.requester.trainingProviderAccount?.organizationName ||
        c.requester.fullName;

      const headline =
        c.requester.candidateProfile?.headline ||
        (c.requester.employerAccount ? "Company / Employer" : null) ||
        (c.requester.trainingProviderAccount ? "Training Provider" : null) ||
        c.requester.roleType.replaceAll("_", " ");

      return {
        id: `conn-req-${c.id}`,
        requestId: c.id,
        userId: auth.userId,
        type: "CONNECTION_REQUEST",
        title: `Connection request from ${requesterName}`,
        message: `${requesterName} (${headline}) sent you a connection request.`,
        actionUrl: "/employers",
        isRead: false,
        createdAt: c.createdAt.toISOString(),
        sender: {
          id: c.requester.id,
          fullName: requesterName,
          avatarUrl: c.requester.avatarUrl,
          headline,
          roleType: c.requester.roleType,
        },
      };
    });

    // 2. Fetch database-stored notifications for this user
    const dbNotifications = await prisma.notification.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const formattedDbNotifications: NotificationItem[] = dbNotifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      type: n.type as any,
      title: n.title,
      message: n.message,
      actionUrl: n.actionUrl || undefined,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));

    // 3. Fallback to demo notifications if no database notifications exist yet
    let fallbackNotifications: NotificationItem[] = [];
    if (formattedDbNotifications.length === 0) {
      fallbackNotifications = await notificationRepository.findAll({
        userId: auth.userId,
        role: auth.userRole,
      });
    }

    const allNotifications: NotificationItem[] = [
      ...connectionNotifications,
      ...formattedDbNotifications,
      ...fallbackNotifications,
    ];

    return successResponse(allNotifications);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch notifications", "FETCH_ERROR", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);

    // Mark database notifications as read
    await prisma.notification.updateMany({
      where: { userId: auth.userId, isRead: false },
      data: { isRead: true },
    }).catch(() => null);

    // Also mark in-memory repository notifications
    await notificationRepository.markAllAsRead(auth.userId);

    return successResponse({ markedAllAsRead: true });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to mark notifications as read", "UPDATE_ERROR", 500);
  }
}
