"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, BookOpen, Wrench, Users } from "lucide-react";
import Link from "next/link";

export default function TrainingFutureFitPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/future-fit")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setEvaluations(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Curriculum Future-Fit Index &amp; Modernization Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluating syllabus alignment with future market demand, trainer upskilling &amp; lab upgrade horizons
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {evaluations.map((ev) => (
          <Card key={ev.courseId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={ev.futureFitGrade === "FUTURE_READY" ? "success" : "destructive"} className="text-[10px]">
                    {ev.futureFitGrade}
                  </Badge>
                  <CardTitle className="text-base font-bold">{ev.courseTitle}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Course ID: {ev.courseId} &bull; Future-Fit Score: <span className="font-bold text-foreground font-mono">{ev.futureFitScore}/100</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground block">Active Curriculum Modules:</span>
                  <div className="flex flex-wrap gap-1">
                    {ev.currentCurriculumSkills?.map((s: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-[9px]">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Future Market Skills to Integrate:</span>
                  <div className="flex flex-wrap gap-1">
                    {ev.futureMarketDemandedSkills?.map((s: string, idx: number) => (
                      <Badge key={idx} variant="success" className="text-[9px]">+ {s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Faculty & Equipment Requirements */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                <span>Trainer Upskilling: {ev.trainerCompetenciesForecast?.[0]?.skillName} (Gap: {ev.trainerCompetenciesForecast?.[0]?.facultyGap} Faculty)</span>
                <span>Equipment Horizon: {ev.equipmentDemandForecast?.[0]?.equipmentCategory} ({ev.equipmentDemandForecast?.[0]?.upgradeHorizonMonths}M)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
