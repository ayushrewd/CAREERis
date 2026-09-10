"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CandidateTrajectoryPage() {
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

      <div>
        <h1 className="text-xl font-bold font-heading">Personalized Career Trajectory Pathways</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Predictive multi-stage progression roadmaps tailored to your active Skill Passport
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trajectories.map((traj) => (
          <Card key={traj.pathId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="success" className="text-[10px]">Feasibility: {traj.feasibilityScore}/100</Badge>
                <span className="text-xs font-mono font-bold text-primary">{traj.timeHorizonMonths} Months</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{traj.targetRoleTitle}</CardTitle>
              <CardDescription className="text-xs">{traj.targetIndustry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-2 rounded-lg border bg-muted/20">
                <span className="text-[10px] text-muted-foreground block">{traj.whyThisPath?.[0]}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground font-mono">Readiness: {traj.overallReadinessPercentage}%</span>
                <Link href="/candidate/career-map">
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    View Map <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
