"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, CheckCircle2, Award, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function CandidateCareerMapPage() {
  const [trajectories, setTrajectories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidate/career-trajectory")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTrajectories(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/candidate/profile">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Candidate Profile
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Interactive Career Trajectory &amp; Pathway Map</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step vocational pathways connecting your baseline skills to high-growth target roles
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {trajectories.map((traj) => (
          <Card key={traj.pathId} className="shadow-subtle border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">
                    Feasibility: {traj.feasibilityScore}/100
                  </Badge>
                  <CardTitle className="text-lg font-bold">{traj.targetRoleTitle}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Industry: {traj.targetIndustry} &bull; Estimated Timeline: {traj.timeHorizonMonths} Months
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-primary block">
                  Readiness: {traj.overallReadinessPercentage}%
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Sequential Steps Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {traj.steps?.map((step: any) => (
                  <div key={step.stepIndex} className="p-3 rounded-xl border bg-card space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] font-mono">Step {step.stepIndex}</Badge>
                      <span className="text-[9px] text-muted-foreground">{step.durationMonths > 0 ? `${step.durationMonths} Mo` : "Baseline"}</span>
                    </div>
                    <span className="font-bold text-foreground block text-xs">{step.title}</span>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{step.description}</p>
                    {step.potentialSalaryRangeINR && (
                      <span className="text-[10px] text-emerald-600 font-semibold block pt-1">
                        Salary: {formatCurrencyINR(step.potentialSalaryRangeINR.min)} - {formatCurrencyINR(step.potentialSalaryRangeINR.max)}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Rationale & Disclaimer */}
              <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Why This Pathway:</span>
                {traj.whyThisPath?.map((w: string, idx: number) => (
                  <p key={idx} className="text-[11px] text-muted-foreground">&bull; {w}</p>
                ))}
                <span className="text-[9px] text-muted-foreground italic block pt-1">{traj.disclaimer}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
