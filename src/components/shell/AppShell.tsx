"use client";

import React, { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { GlobalAIAssistant } from "./GlobalAIAssistant";
import { MobileBottomBar } from "./MobileBottomBar";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getRoleDefaultRoute } from "@/lib/rbac";
import { canAccessRolePath } from "@/lib/rbac/roleRoutes";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/about" || pathname === "/trust" || pathname.startsWith("/verify/");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) router.replace("/login");
    else if (!isLoading && user && !isPublicRoute && !canAccessRolePath(user.roleType, pathname)) router.replace(getRoleDefaultRoute(user.roleType));
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router, user]);

  if (isLoading && !isPublicRoute) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Checking your session...</div>;
  }

  if (!isAuthenticated && !isPublicRoute) return null;
  if (user && !isPublicRoute && !canAccessRolePath(user.roleType, pathname)) return null;

  const isFullWidthFeed = pathname === "/feed" || pathname === "/" || pathname === "/jobs";

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased pb-16 md:pb-0">
      {/* Global Topbar */}
      {!isPublicRoute && <Topbar onToggleMobileNav={() => setIsMobileNavOpen(true)} />}

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {!isPublicRoute && !isFullWidthFeed && <Sidebar />}
        <main className="flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {!isPublicRoute && <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />}

      {/* Mobile App Bottom Bar (Smartphone native experience) */}
      {!isPublicRoute && <MobileBottomBar />}

      {/* Global Floating AI Assistant */}
      {!isPublicRoute && <GlobalAIAssistant />}
    </div>
  );
}
