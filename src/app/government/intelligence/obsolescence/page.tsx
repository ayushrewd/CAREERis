"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, ArrowRight, BookOpen, Filter } from "lucide-react";
import Link from "next/link";
import { CourseObsolescenceProfile } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function ObsolescenceRadarPage() {
  const [reports, setReports] = useState<CourseObsolescenceProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/obsolescence")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReports(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-amber-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Course Obsolescence &amp; Risk Radar</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Vocational Obsolescence Detector
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-warning detection across demand contraction, low placement, and curriculum aging
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Human Governance Policy:</strong> CareerIS detects obsolescence risk and recommends curriculum review. No algorithm automatically retires courses, terminates faculty, or cancels approved seating.
        </div>
      </div>

      {/* Reports Table */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Evaluated Vocational Courses ({reports.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review risk classification, demand YoY, placement rate, and recommended governance actions
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading obsolescence signals...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Course &amp; Provider</th>
                    <th className="px-4 py-3 font-semibold text-center">Risk Level</th>
                    <th className="px-4 py-3 font-semibold text-right">Demand YoY</th>
                    <th className="px-4 py-3 font-semibold text-right">Placement</th>
                    <th className="px-4 py-3 font-semibold text-center">Curriculum Age</th>
                    <th className="px-4 py-3 font-semibold">Primary Evidence</th>
                    <th className="px-4 py-3 font-semibold">Recommended Action</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {reports.map((r) => (
                    <tr key={r.courseId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{r.courseTitle}</div>
                        <div className="text-[11px] text-muted-foreground">{r.providerName} • {r.district}, {r.state}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={r.riskLevel === "CRITICAL" ? "destructive" : r.riskLevel === "LOW" ? "secondary" : "default"}>
                          {r.riskLevel}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${r.signals.demandDeclineRateYoY < 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {r.signals.demandDeclineRateYoY > 0 ? "+" : ""}{r.signals.demandDeclineRateYoY}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">
                        {r.signals.placementRate}%
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {r.signals.curriculumAgeYears} yrs
                      </td>
                      <td className="px-4 py-3 max-w-xs text-[11px] text-muted-foreground">
                        {r.evidence[0] || "Aligned with standard"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[11px] text-primary">
                        {r.recommendedReviewAction.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/government/courses/${r.courseId}/health`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DataProvenancePanel
        sources={["DVET Tracer Studies", "NCVT Course History", "Job Market Stream Analysis"]}
        timePeriod="2026-Q2 Evaluation"
        confidenceScore={0.96}
        isSyntheticPilotData={false}
        methodology="Multi-warning obsolescence matrix evaluating YoY job growth, 3-year graduate placement trends, technology substitution, and syllabus revision dates."
      />
    </div>
  );
}
