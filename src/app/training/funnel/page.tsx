"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TrainingFunnelPage() {
  const [data, setData] = useState<any>(null);
  const [marketFit, setMarketFit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/training/funnel").then((r) => r.json()),
      fetch("/api/training/outcomes").then((r) => r.json()),
    ])
      .then(([funnelRes, outRes]) => {
        if (funnelRes.success) setData(funnelRes.data);
        if (outRes.success) setMarketFit(outRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const stages = data?.stages || [];
  const dropOff = data?.dropOffAnalysis;

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
          <h1 className="text-xl font-bold font-heading">Training-to-Employment Funnel &amp; Drop-off Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conversion tracking from candidate interest to Skill Passport verification and verified hiring outcomes
          </p>
        </div>
      </div>

      {/* 9-Stage Visual Funnel Grid */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">9-Stage National Vocational Funnel</CardTitle>
          <CardDescription className="text-xs">Volume throughput and stage-by-stage conversion metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 text-center text-xs">
            {stages.map((st: any, idx: number) => (
              <div key={st.stageName} className="p-3 rounded-xl border bg-card space-y-1 relative">
                <span className="text-[9px] font-bold text-muted-foreground block">{st.stageName}</span>
                <span className="text-sm font-bold font-mono text-foreground block">
                  {(st.volume / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">{st.conversionRatePercentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Leakage Analysis */}
      {dropOff && (
        <Card className="shadow-subtle border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Drop-off &amp; Leakage Root-Cause Analysis</CardTitle>
            <CardDescription className="text-xs">Identified bottleneck stages with high drop-off volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-2">
              {dropOff.majorLeakageStages?.map((l: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[10px]">{l.stageName}</Badge>
                      <span className="font-bold text-foreground">-{l.dropOffCount?.toLocaleString()} Candidates ({l.dropOffRatePercentage}%)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{l.primaryReason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Market Fit Scores */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Course Market Fit Scores &amp; Portfolio Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketFit.map((m) => (
            <Card key={m.courseId} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant={m.portfolioClassification === "EXPAND" ? "success" : "warning"} className="text-[10px]">
                    {m.portfolioClassification}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-primary">Fit Score: {m.overallFitScore}/100</span>
                </div>
                <CardTitle className="text-base font-bold pt-1">{m.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-[11px] text-muted-foreground">{m.actionRecommendation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
