"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ShieldCheck, GraduationCap, Users, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InstituteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [scorecard, setScorecard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/training/institutes/${id}/scorecard`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setScorecard(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading institute scorecard...</div>;
  if (!scorecard?.institute) return <div className="p-8 text-center text-sm text-muted-foreground">Institute not found.</div>;

  const inst = scorecard.institute;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training/institutes">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> All Institutes
          </Button>
        </Link>
      </div>

      {/* Institute Header Banner */}
      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{inst.name}</h1>
            <Badge variant="outline" className="text-xs font-mono">{inst.code}</Badge>
            <Badge variant="success" className="text-xs">
              Health Score: {scorecard.overallHealthScore}/100 ({scorecard.healthClassification})
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {inst.districtName}, {inst.stateName} &bull; Affiliation: {inst.affiliation} &bull; Principal: {inst.principalName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/training/actions?instituteId=${inst.id}`}>
            <Button size="sm" className="text-xs">
              Action Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* 10-Dimension Scorecard with Explainability */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Explainable Component Breakdown</CardTitle>
          <CardDescription className="text-xs">Component scores and empirical rationale behind each dimension</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {scorecard.whyIsThisScoreRanked &&
            Object.entries(scorecard.whyIsThisScoreRanked).map(([key, item]: any) => (
              <div key={key} className="p-3 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <p className="text-[11px] text-muted-foreground">{item.explanation}</p>
                </div>
                <Badge variant={item.score >= 85 ? "success" : item.score >= 70 ? "default" : "warning"} className="text-xs font-mono self-start sm:self-center">
                  {item.score}/100
                </Badge>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
