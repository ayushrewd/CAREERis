"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Home,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  User,
  PlusCircle,
} from "lucide-react";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { currentRole } = useAuth();
  const candidateItems = [
    { label: "Feed", href: "/feed", icon: Home },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Passport", href: "/candidate/skill-passport", icon: ShieldCheck },
    { label: "Learn", href: "/courses", icon: GraduationCap },
    { label: "Profile", href: "/candidate/profile", icon: User },
  ];
  const employerItems = [
    { label: "Dashboard", href: "/employer", icon: Home },
    { label: "Jobs", href: "/employer/jobs", icon: Briefcase },
    { label: "Post Job", href: "/employer/jobs/new", icon: PlusCircle },
    { label: "Network", href: "/employers", icon: ShieldCheck },
    { label: "Company", href: "/employer/profile", icon: User },
  ];
  const providerItems = [
    { label: "Dashboard", href: "/training-provider", icon: Home },
    { label: "Courses", href: "/training-provider/courses", icon: GraduationCap },
    { label: "Curriculum", href: "/training-provider/curriculum", icon: Briefcase },
    { label: "Trainers", href: "/training-provider/trainers", icon: ShieldCheck },
    { label: "Profile", href: "/training-provider/profile", icon: User },
  ];
  const governmentItems = [
    { label: "Dashboard", href: "/district-admin", icon: Home },
    { label: "Districts", href: "/government/districts", icon: Briefcase },
    { label: "Skill Gaps", href: "/government/skill-gaps", icon: ShieldCheck },
    { label: "Plans", href: "/government/district-plans", icon: GraduationCap },
    { label: "Overview", href: "/government", icon: User },
  ];
  const navItems = currentRole === "EMPLOYER" ? employerItems : currentRole === "TRAINING_PROVIDER" ? providerItems : currentRole === "DISTRICT_ADMIN" || currentRole === "GOVERNMENT_ADMIN" ? governmentItems : candidateItems;

  return (
    <>
      {/* Native Mobile App Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t shadow-2xl safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-15 items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/feed"
                ? pathname === "/feed"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? "text-primary font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? "bg-primary/10" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary stroke-[2.5]" : ""}`} />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
