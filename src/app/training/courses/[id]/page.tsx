"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ShieldCheck, TrendingUp, AlertTriangle, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/training/courses/${id}/health`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setHealth(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading course health dossier...</div>;
  if (!health) return <div className="p-8 text-center text-sm text-muted-foreground">Course not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training/courses">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Course Radar
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{health.courseTitle}</h1>
            <Badge variant="outline" className="text-xs font-mono">{health.courseCode}</Badge>
            <Badge
              variant={health.classification === "EXCELLENT" ? "success" : health.classification === "HEALTHY" ? "default" : "warning"}
              className="text-xs"
            >
              {health.classification} ({health.healthScore}/100)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {health.instituteName} &bull; {health.districtName}, {health.stateCode}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={health.recommendedAction === "EXPAND" ? "success" : "default"} className="text-xs">
            Action: {health.recommendedAction}
          </Badge>
        </div>
      </div>

      {/* 7-Dimension Components Grid */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">7-Dimension Course Health Evaluation</CardTitle>
          <CardDescription className="text-xs">Exposing all empirical components &bull; No hidden metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {health.components &&
            Object.entries(health.components).map(([key, val]: any) => (
              <div key={key} className="p-3 rounded-xl border bg-card space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground block capitalize truncate">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-lg font-bold font-mono text-foreground block">
                  {val}/100
                </span>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${val >= 85 ? "bg-emerald-500" : val >= 70 ? "bg-primary" : "bg-amber-500"}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Obsolescence & Oversupply Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Obsolescence Risk Diagnostic</CardTitle>
            <CardDescription className="text-xs">Tracking curriculum aging &amp; market hiring shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Obsolescence Risk Level:</span>
              <Badge variant={health.obsolescenceRisk?.level === "LOW_RISK" ? "success" : "warning"} className="text-xs">
                {health.obsolescenceRisk?.level}
              </Badge>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground block">Observed Signals:</span>
              {health.obsolescenceRisk?.signals?.map((s: string, idx: number) => (
                <p key={idx} className="text-[11px] text-muted-foreground">&bull; {s}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Oversupply &amp; Capacity Check</CardTitle>
            <CardDescription className="text-xs">Sanctioned seats vs regional employer demand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Oversupply Status:</span>
              <Badge variant="outline" className="text-xs">{health.oversupplyStatus?.classification}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{health.oversupplyStatus?.recommendationText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
