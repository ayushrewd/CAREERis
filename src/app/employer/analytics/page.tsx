"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendingUp, ArrowLeft, ArrowRight, Clock, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function EmployerAnalyticsPage() {
  const [funnel, setFunnel] = useState<any>(null);
  const [timeToHire, setTimeToHire] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [funRes, timeRes] = await Promise.all([
          fetch("/api/employer/analytics/funnel?employerId=comp-tata-motors").then((r) => r.json()),
          fetch("/api/employer/analytics/time-to-hire?employerId=comp-tata-motors").then((r) => r.json()),
        ]);

        if (funRes.success) setFunnel(funRes.data);
        if (timeRes.success) setTimeToHire(timeRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Recruitment Funnel &amp; Time-to-Hire Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conversion diagnostics, drop-off detection, and duration intelligence across requisitions
          </p>
        </div>
      </div>

      {/* Top Conversion Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-subtle p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground block">Application to Shortlist</span>
          <span className="text-2xl font-bold font-mono text-foreground">{funnel?.conversionRates?.shortlistRate || 38}%</span>
          <span className="text-[10px] text-muted-foreground block">Screening conversion</span>
        </Card>
        <Card className="shadow-subtle p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground block">Shortlist to Interview</span>
          <span className="text-2xl font-bold font-mono text-blue-600">{funnel?.conversionRates?.interviewRate || 37}%</span>
          <span className="text-[10px] text-muted-foreground block">Technical panel booking</span>
        </Card>
        <Card className="shadow-subtle p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground block">Interview to Offer</span>
          <span className="text-2xl font-bold font-mono text-purple-600">{funnel?.conversionRates?.offerRate || 50}%</span>
          <span className="text-[10px] text-muted-foreground block">Panel pass rate</span>
        </Card>
        <Card className="shadow-subtle p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground block">Offer to Hire</span>
          <span className="text-2xl font-bold font-mono text-emerald-600">{funnel?.conversionRates?.hireRate || 67}%</span>
          <span className="text-[10px] text-muted-foreground block">Candidate acceptance rate</span>
        </Card>
      </div>

      {/* Funnel Visualisation */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Recruitment Pipeline Funnel Drop-off</CardTitle>
          <CardDescription className="text-xs">
            Stages from initial verified application to closed placement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnel?.funnelStages?.map((st: any, idx: number) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{st.stageName}</span>
                <span className="font-mono font-bold text-foreground">{st.count} Candidates ({st.conversionFromPrevious}%)</span>
              </div>
              <ProgressBar value={st.conversionFromPrevious} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Time to Hire Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm font-bold">Time-to-Hire by Role</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeToHire?.byRole?.map((r: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border bg-card text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">{r.roleTitle}</span>
                  <span className="text-[10px] text-muted-foreground">Sample Size: {r.sampleSize} hires</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-foreground block">{r.averageDays} Days</span>
                  <Badge variant={r.difficulty === "VERY_HIGH" ? "destructive" : "secondary"} className="text-[9px]">
                    {r.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <CardTitle className="text-sm font-bold">Bottleneck Detection &amp; Diagnostics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {funnel?.bottleneckDiagnostics?.map((b: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/20 space-y-1.5">
                <span className="font-bold text-foreground block">{b.stage}</span>
                <p className="text-muted-foreground text-[11px]">{b.finding}</p>
                <p className="text-primary font-medium text-[11px]">&rarr; Action: {b.recommendedAction}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
