"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { X, Compass, Briefcase, Sparkles, BookOpen, Building2, BarChart3, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoleDisplayName } from "@/lib/rbac";
import { DownloadAppButton } from "../pwa/DownloadAppButton";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { currentRole } = useAuth();

  if (!isOpen) return null;

  const navLinks = [
    { title: "Home", href: "/feed", icon: <Compass className="w-4 h-4" /> },
    { title: "Jobs & Opportunities", href: "/jobs", icon: <Briefcase className="w-4 h-4" /> },
    { title: "Skill Graph", href: "/skills", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Courses & Curricula", href: "/courses", icon: <BookOpen className="w-4 h-4" /> },
    { title: "Employers", href: "/employers", icon: <Building2 className="w-4 h-4" /> },
    { title: "Labour Market Insights", href: "/insights", icon: <BarChart3 className="w-4 h-4" /> },
    { title: "About CareerIS", href: "/about", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card border-r shadow-2xl p-4 flex flex-col z-10">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-base">CAREERIS</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-2 text-[10px] uppercase font-bold text-primary tracking-wider">
          Active Role: {getRoleDisplayName(currentRole)}
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.title}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Download App on Device */}
        <div className="py-2 border-t">
          <DownloadAppButton variant="nav" />
        </div>

        <div className="pt-2 text-[11px] text-muted-foreground">
          CareerIS &bull; SIH Pilot Geography: Maharashtra
        </div>
      </div>
    </div>
  );
}
