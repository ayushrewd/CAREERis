"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendingUp, ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, Wrench, Users } from "lucide-react";

export default function TrainingProviderCourseHealthPage() {
  const healthMetrics = [
    {
      course: "Advanced Certificate in EV Battery Management & Diagnostics",
      overall: 92.5,
      demandAlignment: 95,
      curriculumFreshness: 92,
      trainerCapacity: 90,
      equipmentReadiness: 96,
      placementOutcome: 91,
    },
    {
      course: "Industry 4.0 PLC Automation & SCADA Programming",
      overall: 88.0,
      demandAlignment: 89,
      curriculumFreshness: 86,
      trainerCapacity: 92,
      equipmentReadiness: 90,
      placementOutcome: 85,
    },
    {
      course: "5-Axis CNC Precision Machining & Tooling",
      overall: 91.0,
      demandAlignment: 94,
      curriculumFreshness: 88,
      trainerCapacity: 95,
      equipmentReadiness: 92,
      placementOutcome: 93,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Dimensional Quality Index</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Vocational Course Health Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent composite health scoring derived from industry hiring demand, lab equipment census, trainer ToT credentials, and placement retention.
          </p>
        </div>

        <Badge variant="purple" className="text-xs">
          Simulated Benchmark Scoring (Demo Data)
        </Badge>
      </div>

      {/* Health Cards */}
      <div className="space-y-6">
        {healthMetrics.map((hm, idx) => (
          <Card key={idx} className="border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="p-6 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">{hm.course}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Government ITI Aundh (Centre of Excellence, Pune)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black font-heading text-emerald-600 dark:text-emerald-400">
                    {hm.overall}%
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Composite Health Index</span>
                </div>
              </div>

              {/* 5 Dimensional Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-muted/20 border">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Demand Fit</span>
                    <span className="font-bold text-foreground">{hm.demandAlignment}%</span>
                  </div>
                  <ProgressBar value={hm.demandAlignment} size="sm" showValue={false} variant="primary" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Curriculum</span>
                    <span className="font-bold text-foreground">{hm.curriculumFreshness}%</span>
                  </div>
                  <ProgressBar value={hm.curriculumFreshness} size="sm" showValue={false} variant="success" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Trainer ToT</span>
                    <span className="font-bold text-foreground">{hm.trainerCapacity}%</span>
                  </div>
                  <ProgressBar value={hm.trainerCapacity} size="sm" showValue={false} variant="info" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Equipment</span>
                    <span className="font-bold text-foreground">{hm.equipmentReadiness}%</span>
                  </div>
                  <ProgressBar value={hm.equipmentReadiness} size="sm" showValue={false} variant="warning" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Placement</span>
                    <span className="font-bold text-foreground">{hm.placementOutcome}%</span>
                  </div>
                  <ProgressBar value={hm.placementOutcome} size="sm" showValue={false} variant="success" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
