"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getRoleDisplayName } from "@/lib/rbac";
import {
  Home,
  Compass,
  Briefcase,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  User,
  Building2,
  Settings,
  Users,
  MessageSquare,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole } = useAuth();

  const getRoleNavItems = (): NavItem[] => {
    switch (currentRole) {
      case "CANDIDATE":
        return [
          { title: "Feed", href: "/feed", icon: <Home className="w-4 h-4" /> },
          { title: "Career Goal", href: "/candidate/goals", icon: <Compass className="w-4 h-4" /> },
          { title: "Skill Diagnostic", href: "/candidate/quiz", icon: <BrainCircuit className="w-4 h-4" /> },
          { title: "Skill Gaps", href: "/candidate/readiness", icon: <Sparkles className="w-4 h-4" /> },
          { title: "Learning Path", href: "/candidate/learning", icon: <BrainCircuit className="w-4 h-4" /> },
          { title: "Explore Jobs", href: "/jobs", icon: <Briefcase className="w-4 h-4" /> },
          { title: "Projects", href: "/candidate/projects", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "Skill Passport", href: "/candidate/skill-passport", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "Messages", href: "/messages", icon: <MessageSquare className="w-4 h-4" /> },
          { title: "My Profile", href: "/candidate/profile", icon: <User className="w-4 h-4" /> },
        ];
      case "EMPLOYER":
        return [
          { title: "Company Dashboard", href: "/employer", icon: <Home className="w-4 h-4" /> },
          { title: "Company Jobs", href: "/employer/jobs", icon: <Briefcase className="w-4 h-4" /> },
          { title: "Post New Job", href: "/employer/jobs/new", icon: <Sparkles className="w-4 h-4" /> },
          { title: "Post-Hire Feedback", href: "/employer/feedback", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "Active Job Listings", href: "/jobs", icon: <Building2 className="w-4 h-4" /> },
          { title: "Network", href: "/employers", icon: <Users className="w-4 h-4" /> },
          { title: "Company Profile", href: "/employer/profile", icon: <Building2 className="w-4 h-4" /> },
        ];
      case "TRAINING_PROVIDER":
        return [
          { title: "Provider Dashboard", href: "/training-provider", icon: <Home className="w-4 h-4" /> },
          { title: "Courses", href: "/training-provider/courses", icon: <Briefcase className="w-4 h-4" /> },
          { title: "Curriculum", href: "/training-provider/curriculum", icon: <Sparkles className="w-4 h-4" /> },
          { title: "Trainers", href: "/training-provider/trainers", icon: <Users className="w-4 h-4" /> },
          { title: "Equipment", href: "/training-provider/equipment", icon: <Settings className="w-4 h-4" /> },
          { title: "Provider Profile", href: "/training-provider/profile", icon: <Building2 className="w-4 h-4" /> },
        ];
      case "DISTRICT_ADMIN":
      case "GOVERNMENT_ADMIN":
        return [
          { title: "Government DSDO Hub", href: "/district-admin", icon: <Building2 className="w-4 h-4" /> },
          { title: "District Skill Gaps", href: "/government/skill-gaps", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "District Training Plans", href: "/government/district-plans", icon: <Sparkles className="w-4 h-4" /> },
          { title: "Registered Companies", href: "/employers", icon: <Briefcase className="w-4 h-4" /> },
        ];
      case "PLATFORM_ADMIN":
        return [
          { title: "Admin Console", href: "/admin", icon: <Settings className="w-4 h-4" /> },
          { title: "User Master Registry", href: "/admin/users", icon: <Users className="w-4 h-4" />, badge: "Protected" },
        ];
      default:
        return [
          { title: "Feed", href: "/feed", icon: <Home className="w-4 h-4" /> },
          { title: "Candidate Center", href: "/candidate", icon: <Compass className="w-4 h-4" /> },
          { title: "Explore Jobs", href: "/jobs", icon: <Briefcase className="w-4 h-4" /> },
          { title: "Skill Test", href: "/candidate/quiz", icon: <BrainCircuit className="w-4 h-4" /> },
          { title: "Skill Passport", href: "/candidate/skill-passport", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "My Profile", href: "/candidate/profile", icon: <User className="w-4 h-4" /> },
        ];
    }
  };

  const roleNavItems = getRoleNavItems();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-card/60 backdrop-blur-sm min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Role-Specific Workspace Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-primary flex items-center justify-between">
            <span>Workspace</span>
            <span className="text-[9px] bg-primary/10 px-1.5 py-0.5 rounded font-semibold text-primary">
              {getRoleDisplayName(currentRole)}
            </span>
          </div>

          <nav className="space-y-0.5">
            {roleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-mono px-1.5 py-0.2 rounded-full",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-[11px] text-muted-foreground bg-muted/20">
        <span>Evidence-based workspace</span>
      </div>
    </aside>
  );
}
