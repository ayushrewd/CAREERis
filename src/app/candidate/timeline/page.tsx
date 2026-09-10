"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { History, GraduationCap, Award, ShieldCheck, Briefcase, CheckCircle2, Clock } from "lucide-react";

export default function CandidateTimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await fetch("/api/candidate/timeline").then((r) => r.json());
        if (res.success) setEvents(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  const eventIcons: Record<string, any> = {
    EDUCATION_ENROLLED: GraduationCap,
    COURSE_COMPLETED: Award,
    ASSESSMENT_PASSED: ShieldCheck,
    SKILL_VERIFIED: CheckCircle2,
    JOB_APPLIED: Briefcase,
    PROJECT_SUBMITTED: Award,
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs border-primary/30">
              <History className="w-3 h-3 mr-1" />
              Career Journey
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Chronological Career Timeline
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
            Audit trail of educational milestones, vocational lab completions, proctored assessments, and job application submissions.
          </p>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l border-border/80 ml-4 md:ml-6 space-y-6 pl-6 py-2">
        {events.map((evt, idx) => {
          const Icon = eventIcons[evt.eventType] || Clock;
          return (
            <div key={evt.id || idx} className="relative group">
              <div className="absolute -left-[35px] top-1.5 p-2 rounded-full border bg-card text-primary shadow-subtle group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>

              <Card className="bg-card/80 hover:border-primary/40 transition-all">
                <CardContent className="p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {evt.eventType.replace(/_/g, " ")}
                      </Badge>
                      {evt.verifiedBy && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Verified by {evt.verifiedBy}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{evt.eventDate}</span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-foreground">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {evt.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <DataProvenancePanel
        sources={["CareerIS Chronological Event Registry", "MSDE NCVT Portal", "ASDC Assessment Records"]}
        timePeriod="2023 - 2026 Active"
        confidenceScore={98}
        methodology="Immutable Event-Sourced Career Milestone Logging"
        isSyntheticPilotData={false}
      />
    </div>
  );
}
