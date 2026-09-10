"use client";

import React, { useState, useEffect } from "react";
import { platformStore, ApplicationRecord, ApplicationStage } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  Calendar,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const STAGES: { stage: ApplicationStage; label: string }[] = [
  { stage: "APPLIED", label: "Applied" },
  { stage: "VIEWED", label: "Viewed" },
  { stage: "SHORTLISTED", label: "Shortlisted" },
  { stage: "ASSESSMENT_REQUESTED", label: "Assessment" },
  { stage: "INTERVIEW_SCHEDULED", label: "Interview" },
  { stage: "OFFERED", label: "Offer" },
  { stage: "HIRED", label: "Hired" },
];

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState(platformStore.getApplications());

  useEffect(() => {
    return platformStore.subscribe(() => {
      setApplications(platformStore.getApplications());
    });
  }, []);

  const getStageIndex = (stage: ApplicationStage) => {
    return STAGES.findIndex((s) => s.stage === stage);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Real-time Application Tracker</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Application Status &amp; Hiring Pipeline
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent tracking across every stage from initial submission to proctored assessment and technical interview.
          </p>
        </div>

        <Badge variant="purple" className="text-xs">
          {applications.length} Active in Pipeline
        </Badge>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <EmptyState
          title="No active job applications"
          description="Browse skill-mapped job opportunities and submit your verified application."
          actionLabel="Explore Jobs"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentIdx = getStageIndex(app.stage);
            return (
              <Card key={app.id} className="border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-6 space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-primary flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {app.companyName}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mt-0.5">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Applied on {formatDate(app.appliedAt)} &bull; Explainable Skill Fit: <strong>{app.matchScore}%</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                        <Link href="/messages">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Message Recruiter
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Stage Progression Timeline */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Hiring Stage Timeline:
                    </span>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {STAGES.map((s, idx) => {
                        const isPast = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        return (
                          <div key={s.stage} className="space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? "bg-primary shadow-sm"
                                  : isPast
                                  ? "bg-emerald-500"
                                  : "bg-muted"
                              }`}
                            />
                            <span
                              className={`text-[10px] block truncate font-medium ${
                                isCurrent
                                  ? "text-primary font-bold"
                                  : isPast
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage-specific Feedback & Next Actions */}
                  {app.stage === "INTERVIEW_SCHEDULED" && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <div className="flex items-center gap-2 font-semibold">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Technical Interview Scheduled</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Monday, 02 March 2026 at 11:00 AM &bull; Tata Motors Chakan Plant 2 (Gate 3 Lab).
                      </p>
                    </div>
                  )}

                  {app.coverNote && (
                    <div className="p-3.5 rounded-xl bg-muted/20 border text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Your Attached Submission Note:
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        &ldquo;{app.coverNote}&rdquo;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
