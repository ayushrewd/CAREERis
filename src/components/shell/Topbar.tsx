"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  ChevronDown,
  LayoutGrid,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sparkles,
  Building2,
  Bookmark,
  Calendar,
} from "lucide-react";
import { GlobalSearch } from "../search/GlobalSearch";
import { NotificationDrawer } from "../notifications/NotificationDrawer";
import { usePathname } from "next/navigation";
import { CareerISLogo } from "../ui/CareerISLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleDisplayName } from "@/lib/rbac";
import { getRoleProfileRoute } from "@/lib/rbac/roleRoutes";
import { DownloadAppButton } from "../pwa/DownloadAppButton";

interface TopbarProps {
  onToggleMobileNav: () => void;
}

export function Topbar({ onToggleMobileNav }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setUnreadNotifs(0);
      return;
    }
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        const unread = json.data.filter((n: any) => !n.isRead).length;
        setUnreadNotifs(unread);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchNotifications]);
  const homeHref = user ? "/feed" : "/";
  const profileHref = getRoleProfileRoute(user?.roleType);
  const jobsHref = user?.roleType === "EMPLOYER" ? "/employer/jobs" : "/jobs";
  const messagesHref = "/messages";
  const identityName = user?.companyName || user?.organizationName || user?.departmentName || user?.fullName || "Account";
  const identityParts = identityName.split(/\s+/).filter(Boolean);
  const identityInitials = (identityParts.length === 1 ? identityName.slice(0, 2) : identityParts.slice(0, 2).map((part) => part[0]).join("")).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-card/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-3 sm:px-4">
          {/* Left: Brand Logo & Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleMobileNav}
              className="p-1.5 rounded-md md:hidden hover:bg-muted text-muted-foreground"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href={homeHref} className="flex items-center gap-2 group shrink-0 pr-2">
              <CareerISLogo size="md" showText={true} showTagline={false} />
            </Link>

            <div className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-muted-foreground bg-muted/70 hover:bg-muted border rounded-full transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span>Search people, jobs, skills...</span>
                </div>
                <kbd className="hidden md:inline-flex items-center text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Center and right navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* 1. Home */}
            <Link
              href={homeHref}
              className={`flex flex-col items-center justify-center px-2 sm:px-3 py-1 text-[11px] font-medium transition-all relative ${
                pathname === "/feed" || pathname === "/"
                  ? "text-foreground font-bold border-b-2 border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Home</span>
            </Link>

            {/* 2. My Network */}
            <Link
              href="/employers"
              className={`flex flex-col items-center justify-center px-2 sm:px-3 py-1 text-[11px] font-medium transition-all ${
                pathname.startsWith("/employers")
                  ? "text-foreground font-bold border-b-2 border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">My Network</span>
            </Link>

            {/* 3. Jobs */}
            <Link
              href={jobsHref}
              className={`flex flex-col items-center justify-center px-2 sm:px-3 py-1 text-[11px] font-medium transition-all ${
                pathname.startsWith("/jobs")
                  ? "text-foreground font-bold border-b-2 border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Jobs</span>
            </Link>

            {/* 4. Messaging */}
            <Link
              href={messagesHref}
              className={`flex flex-col items-center justify-center px-2 sm:px-3 py-1 text-[11px] font-medium transition-all ${pathname.startsWith("/messages") ? "text-foreground font-bold border-b-2 border-foreground pb-0.5" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Messaging</span>
            </Link>

            {/* 5. Notifications */}
            <button
              onClick={() => {
                setIsNotifOpen(true);
                fetchNotifications();
              }}
              className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all relative"
            >
              <div className="relative">
                <Bell className="w-5 h-5 mb-0.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Notifications</span>
            </button>

            {/* 6. Me (Profile Dropdown) */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex flex-col items-center justify-center px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-[10px] overflow-hidden border border-border">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={identityName} className="w-full h-full object-cover" />
                  ) : user ? (
                    identityInitials
                  ) : (
                    "ME"
                  )}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="hidden md:inline text-[10px]">Me</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl p-3 space-y-3 z-50 animate-in zoom-in-95 duration-150 text-xs">
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm overflow-hidden border">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={identityName} className="w-full h-full object-cover" />
                      ) : user ? (
                        identityInitials
                      ) : (
                        "ME"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate">
                        {user ? identityName : "Signed-out user"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user?.headline || (user?.roleType ? getRoleDisplayName(user.roleType) : "No profile headline")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={profileHref}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>View &amp; Edit Profile</span>
                    </Link>

                    {user?.roleType === "CANDIDATE" && <Link
                      href="/candidate/skill-passport"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>My Skill Passport</span>
                    </Link>}

                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                        window.location.assign("/login");
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors font-semibold text-left pt-2 border-t mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Download App Button */}
            <DownloadAppButton variant="topbar" />

            {/* Vertical Divider */}
            <div className="hidden lg:block w-[1px] h-8 bg-border mx-1" />

            {/* 7. For Business (9-dots Grid Icon) */}
            {user?.roleType === "PLATFORM_ADMIN" && <div className="relative hidden lg:block">
              <button
                onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
                className="flex flex-col items-center justify-center px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <LayoutGrid className="w-5 h-5 mb-0.5" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">For Business</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </button>

              {isBusinessMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl p-3 space-y-2 z-50 animate-in zoom-in-95 duration-150 text-xs">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">
                    CareerIS Enterprise Hub
                  </span>
                  <Link
                    href="/employer"
                    onClick={() => setIsBusinessMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground transition-colors font-medium"
                  >
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>Company Hiring &amp; Post Jobs</span>
                  </Link>
                  <Link
                    href="/district-admin"
                    onClick={() => setIsBusinessMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground transition-colors font-medium"
                  >
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>Government DSDO Hub</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setIsBusinessMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground transition-colors font-medium border-t pt-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>Master Admin Registry</span>
                  </Link>
                </div>
              )}
            </div>}
          </nav>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => {
          setIsNotifOpen(false);
          fetchNotifications();
        }}
        onUpdate={fetchNotifications}
      />

      {/* Role Gateway Modal */}
    </>
  );
}
