"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Bell,
  Check,
  Briefcase,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  UserPlus,
  Loader2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { NotificationItem, NotificationType } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  onUpdate,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUpdate?.();
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleAcceptConnection = async (requestId: string, notificationId: string) => {
    try {
      setActionBusy(requestId);
      const res = await fetch("/api/social/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPT", requestId }),
      });
      if (res.ok) {
        setAcceptedIds((prev) => new Set(prev).add(notificationId));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        onUpdate?.();
      }
    } catch (e) {
      console.error("Failed to accept connection", e);
    } finally {
      setActionBusy(null);
    }
  };

  const handleDeclineConnection = async (requestId: string, notificationId: string) => {
    try {
      setActionBusy(requestId);
      const res = await fetch("/api/social/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DECLINE", requestId }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        onUpdate?.();
      }
    } catch (e) {
      console.error("Failed to decline connection", e);
    } finally {
      setActionBusy(null);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "CONNECTION_REQUEST":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "CONNECTION_ACCEPTED":
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case "JOB_MATCH":
        return <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "SKILL_VERIFICATION":
        return <ShieldCheck className="w-4 h-4 text-primary" />;
      case "DATA_ALERT":
      case "GOVERNMENT_ALERT":
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "COURSE":
      case "LEARNING":
        return <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(
    (n) => !n.isRead && !acceptedIds.has(n.id)
  ).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-card border-l shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold font-heading text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-xs">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="font-semibold text-foreground">All caught up!</p>
                <p>No new notifications or connection requests.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isConnection =
                  notif.type === "CONNECTION_REQUEST" || Boolean(notif.requestId);
                const isAccepted = acceptedIds.has(notif.id);

                return (
                  <div
                    key={notif.id}
                    onClick={() => !isConnection && markAsRead(notif.id)}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isConnection
                        ? "bg-primary/5 border-primary/30 shadow-xs"
                        : notif.isRead
                        ? "bg-card/50 border-border/60 opacity-85"
                        : "bg-muted/40 border-primary/20 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar / Icon */}
                      <div className="mt-0.5 shrink-0">
                        {isConnection && notif.sender ? (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-primary/20 overflow-hidden">
                            {notif.sender.avatarUrl ? (
                              <img
                                src={notif.sender.avatarUrl}
                                alt={notif.sender.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              notif.sender.fullName.slice(0, 2).toUpperCase()
                            )}
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-background border shadow-2xs">
                            {getIcon(notif.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-foreground text-xs leading-tight">
                            {notif.title}
                          </p>
                          {!notif.isRead && !isAccepted && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-0.5" />
                          )}
                        </div>

                        <p className="mt-1 text-muted-foreground leading-relaxed text-[11px]">
                          {notif.message}
                        </p>

                        {/* Connection Action Buttons */}
                        {isConnection && notif.requestId && (
                          <div className="mt-3 flex items-center gap-2">
                            {isAccepted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Connected
                              </span>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAcceptConnection(notif.requestId!, notif.id)
                                  }
                                  disabled={actionBusy === notif.requestId}
                                  className="h-7 px-3 text-[11px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                                >
                                  {actionBusy === notif.requestId ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDeclineConnection(notif.requestId!, notif.id)
                                  }
                                  disabled={actionBusy === notif.requestId}
                                  className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
                                >
                                  Ignore
                                </Button>
                              </>
                            )}
                          </div>
                        )}

                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{formatRelativeTime(notif.createdAt)}</span>
                          {notif.actionUrl && !isConnection && (
                            <Link
                              href={notif.actionUrl}
                              onClick={onClose}
                              className="text-primary font-medium hover:underline inline-flex items-center"
                            >
                              Open &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-muted/20 border-t text-center text-[11px] text-muted-foreground">
            Real-time connection alerts and system notifications.
          </div>
        </div>
      </div>
    </div>
  );
}
