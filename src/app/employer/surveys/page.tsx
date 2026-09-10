"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function EmployerSurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/employer/surveys").then((r) => r.json()),
      fetch("/api/v1/employer/benchmarks").then((r) => r.json()),
    ])
      .then(([sRes, bRes]) => {
        if (sRes.success) setSurveys(sRes.data || []);
        if (bRes.success) setBenchmarks(bRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <ClipboardList className="w-3.5 h-3.5 mr-1" /> EMPLOYER SKILL SURVEYS &amp; BENCHMARKS
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Skill Demand Feedback &amp; Industry Anonymous Benchmarking
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Employer hiring demand directly informs state training curriculums &amp; regional ITI lab equipment modernization
          </p>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading">Regional Industry Performance Benchmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benchmarks.map((b) => (
            <Card key={b.metricName} className="shadow-subtle p-4 border-primary/20 bg-primary/5">
              <span className="text-xs text-muted-foreground block">{b.metricName}</span>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-xl font-mono font-bold text-primary">
                  {b.employerValue} {b.unit === "DAYS" ? "Days" : "%"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Industry Avg: {b.industryAverage} {b.unit === "DAYS" ? "Days" : "%"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                Percentile Rank: Top {100 - b.percentileRank}% ({b.percentileRank}th Percentile)
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Surveys List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold font-heading">Submitted Skill Demand Surveys</h2>
        {surveys.map((s) => (
          <Card key={s.surveyId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">
                    Outlook: {s.hiringOutlookNext12Months}
                  </Badge>
                  <CardTitle className="text-base font-bold">{s.employerName}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-1">
                  Submitted by: {s.respondentName} ({s.respondentRole}) &bull; Cluster: {s.cluster}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-foreground block">
                  Graduate Quality: {s.satisfactionWithLocalGraduatesScore}/5.0
                </span>
                <span className="text-[10px] text-muted-foreground">Confidence: {s.confidenceScore}%</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground"><strong className="text-foreground">Qualitative Feedback:</strong> {s.qualitativeFeedback}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="font-bold text-foreground mr-1">Demanded Skills:</span>
                {s.topCriticalSkillsDemanded?.map((sk: any) => (
                  <Badge key={sk.skillName} variant="outline" className="text-[10px]">
                    {sk.skillName} (+{sk.hiringNeedVolume})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
