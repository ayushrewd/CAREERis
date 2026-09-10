"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Leaf,
  Briefcase,
  BookOpen,
  Award,
  BarChart3,
  Network,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { CanonicalSkill } from "@/types/skills";

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;

  const [skill, setSkill] = useState<CanonicalSkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "ROLES" | "JOBS" | "COURSES" | "ASSESSMENTS">("OVERVIEW");
  const [roles, setRoles] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (!skillId) return;

    fetch(`/api/skills/${skillId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSkill(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`/api/skills/${skillId}/roles`)
      .then((res) => res.json())
      .then((d) => setRoles(d.data || []))
      .catch(() => {});

    fetch(`/api/skills/${skillId}/jobs`)
      .then((res) => res.json())
      .then((d) => setJobs(d.data || []))
      .catch(() => {});

    fetch(`/api/skills/${skillId}/courses`)
      .then((res) => res.json())
      .then((d) => setCourses(d.data || []))
      .catch(() => {});

    fetch(`/api/skills/${skillId}/assessments`)
      .then((res) => res.json())
      .then((d) => setAssessments(d.data || []))
      .catch(() => {});
  }, [skillId]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-muted-foreground">Loading Skill Dossier...</div>;
  }

  if (!skill) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold font-heading">Canonical Skill Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested competency is not registered in the taxonomy.</p>
        <Link href="/skills">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Skills Taxonomy</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link href="/skills">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Skills Directory</span>
          </Button>
        </Link>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs font-semibold text-foreground">{skill.name}</span>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-primary/10 via-indigo-50/40 to-background dark:from-primary/15 dark:via-background dark:to-background">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-background border text-primary">
                {skill.code}
              </span>
              <Badge variant="default" className="text-xs font-semibold">
                {skill.skillType}
              </Badge>
              {skill.isEmerging && (
                <Badge variant="warning" className="text-xs gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Emerging Competency
                </Badge>
              )}
              {skill.isGreenSkill && (
                <Badge variant="success" className="text-xs gap-1">
                  <Leaf className="w-3 h-3" />
                  Green Skill
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
              {skill.name}
            </h1>

            <p className="text-xs text-muted-foreground font-medium">
              Category: <span className="text-foreground font-semibold">{skill.categoryName}</span>
              {skill.subcategory && ` • Subcategory: ${skill.subcategory}`}
            </p>

            <p className="text-xs text-foreground/90 max-w-3xl leading-relaxed mt-2">
              {skill.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
            <Link href={`/skills/${skill.id}/market`}>
              <Button className="w-full text-xs font-bold gap-1.5 shadow-sm">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Labour Market Demand</span>
              </Button>
            </Link>
            <Link href="/skills/graph">
              <Button variant="outline" className="w-full text-xs font-semibold gap-1.5">
                <Network className="w-3.5 h-3.5 text-primary" />
                <span>Open in Visual Graph</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Known Aliases */}
        {skill.aliases && skill.aliases.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-semibold">
              Canonical Aliases:
            </span>
            {skill.aliases.map((a) => (
              <span
                key={a.id || a.alias}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-background border text-foreground/80 font-medium"
              >
                {a.alias}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-xl border bg-muted/30 p-1 overflow-x-auto">
        {[
          { id: "OVERVIEW", label: "Overview & Relationships", icon: Sparkles },
          { id: "ROLES", label: `Industry Roles (${roles.length})`, icon: Briefcase },
          { id: "JOBS", label: `Active Jobs (${jobs.length})`, icon: Building2 },
          { id: "COURSES", label: `ITI Courses (${courses.length})`, icon: BookOpen },
          { id: "ASSESSMENTS", label: `Diagnostic Tests (${assessments.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "OVERVIEW" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outgoing Graph Relationships */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                Outgoing Competency Relationships
              </h3>
              <p className="text-xs text-muted-foreground">
                Prerequisites, complementary skills, and co-occurring technologies connected in the national graph.
              </p>
              {skill.outgoingRelations && skill.outgoingRelations.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {skill.outgoingRelations.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-2.5 rounded-lg border bg-muted/30 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-foreground block">
                          {rel.targetSkillName || rel.targetSkillId}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Confidence: {Math.round(rel.confidence * 100)}% • Source: {rel.source}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {rel.relationType}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-4">No direct outgoing prerequisites registered.</p>
              )}
            </CardContent>
          </Card>

          {/* Proficiency & Evidence Governance */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Proficiency &amp; Evidence Framework
              </h3>
              <p className="text-xs text-muted-foreground">
                CareerIS requires multi-source evidence to verify proficiency for this competency.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg border bg-background flex items-center justify-between">
                  <span className="font-semibold">Level 4: Advanced</span>
                  <span className="text-muted-foreground">Requires Proctored Assessment ≥ 75%</span>
                </div>
                <div className="p-2.5 rounded-lg border bg-background flex items-center justify-between">
                  <span className="font-semibold">Level 5: Expert</span>
                  <span className="text-muted-foreground">Requires Assessment ≥ 90% + Employer Endorsement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "ROLES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <Card key={r.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground font-bold">{r.code}</span>
                  <Badge variant="outline" className="text-[10px]">NSQF Level {r.nsqfLevel || 6}</Badge>
                </div>
                <h4 className="font-bold text-sm font-heading text-foreground">{r.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sector: {r.sectorName}</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    ₹{(r.typicalSalaryRangeINR?.min / 100000).toFixed(1)}L - ₹{(r.typicalSalaryRangeINR?.max / 100000).toFixed(1)}L
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "JOBS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <Card key={j.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-sm font-heading text-foreground">{j.title}</h4>
                <p className="text-xs text-muted-foreground">{j.companyName} • {j.district}, {j.state}</p>
                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <span className="font-mono text-foreground font-semibold">
                    ₹{(j.salaryRangeINR?.min / 100000).toFixed(1)}L - ₹{(j.salaryRangeINR?.max / 100000).toFixed(1)}L
                  </span>
                  <Link href={`/candidate/jobs/${j.id}`}>
                    <Button size="sm" variant="ghost" className="h-6 text-xs gap-1">
                      <span>View Requisition</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "COURSES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-sm font-heading text-foreground">{c.title}</h4>
                <p className="text-xs text-muted-foreground">{c.providerName} • {c.district}</p>
                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-[10px]">{c.durationHours} Hours</Badge>
                  <Link href={`/courses/${c.id}`}>
                    <Button size="sm" variant="ghost" className="h-6 text-xs gap-1">
                      <span>Course Syllabus</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "ASSESSMENTS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((a) => (
            <Card key={a.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-sm font-heading text-foreground">{a.title}</h4>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">Passing: {a.passingScore}%</span>
                  <Link href="/candidate/assessments">
                    <Button size="sm" className="h-7 text-xs font-bold gap-1">
                      <span>Take Diagnostic</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
