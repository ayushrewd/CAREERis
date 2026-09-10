"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Zap, CheckCircle2, Clock, Award, ArrowRight, ShieldCheck, Flame, BookOpen, Briefcase } from "lucide-react";
import Link from "next/link";

export default function CandidateActionPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await fetch("/api/candidate/action-plan").then((r) => r.json());
        if (res.success) setPlan(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
        Assembling closed-loop personalized execution plan...
      </div>
    );
  }

  const learningPath = plan?.learningPath || {};
  const employability = plan?.employability || {};
  const readiness = plan?.readiness || {};

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs border-primary/30">
              <Zap className="w-3 h-3 mr-1" />
              Comprehensive Execution Plan
            </Badge>
            <Badge variant="success" className="text-[10px] font-mono">
              {employability?.ratingTier?.replace(/_/g, " ")}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Target Career Action Plan
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {employability?.explanation}
          </p>
        </div>

        <div className="text-center p-4 rounded-xl border bg-card/80 min-w-[150px]">
          <div className="text-3xl font-extrabold font-heading text-primary">
            {employability?.score}%
          </div>
          <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
            Employability Indicator
          </div>
          <div className="text-[9px] text-muted-foreground mt-1 max-w-[120px] mx-auto italic">
            Intelligence indicator, not a guarantee.
          </div>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <Card className="bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-heading">Structured Milestone Path</CardTitle>
              <CardDescription className="text-xs">
                {learningPath.targetRoleTitle} • {learningPath.completedHours || 0} / {learningPath.totalEstimatedHours || 0} Hours Completed ({learningPath.overallProgressPercentage || 0}%)
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-primary">
              {learningPath.overallProgressPercentage}% Complete
            </span>
          </div>
          <ProgressBar value={learningPath.overallProgressPercentage || 0} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {(learningPath.milestones || []).map((m: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border bg-background/80 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary">Step {m.stepNumber}:</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {m.stage.replace(/_/g, " ")}
                  </Badge>
                  <h4 className="text-sm font-bold font-heading text-foreground">{m.title}</h4>
                </div>
                <Badge
                  variant={m.status === "COMPLETED" ? "success" : m.status === "IN_PROGRESS" ? "warning" : "outline"}
                  className="text-[10px] font-mono"
                >
                  {m.status}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {m.description}
              </p>

              <div className="p-2.5 rounded bg-muted/40 text-[11px] flex items-center justify-between">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Why this step:</strong> {m.whyThisItem}
                </span>
                {m.estimatedHours > 0 && (
                  <span className="text-muted-foreground font-mono shrink-0 ml-2">{m.estimatedHours}h effort</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <DataProvenancePanel
        sources={["CareerIS Closed-Loop Execution Engine", "National Skill Qualification Framework (NSQF)", "Automotive Skills Development Council"]}
        timePeriod="2026-Q2 Live"
        confidenceScore={98}
        methodology="Automated Closed-Loop Milestone Sequencing (Prerequisites -> Courses -> Hardware Projects -> Proctored Assessments -> OEM Job Placement)"
        isSyntheticPilotData={false}
      />
    </div>
  );
}
