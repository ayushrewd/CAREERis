"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, FileText, IndianRupee, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProgrammeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [programme, setProgramme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/programmes/${id}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setProgramme(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Loading programme lifecycle operations...</div>;
  if (!programme) return <div className="p-12 text-center text-sm text-muted-foreground">Programme not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government/programmes">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> All Programmes
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-[10px] font-mono">{programme.status}</Badge>
            <Badge variant="outline" className="text-[10px]">{programme.scopeLevel}</Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">{programme.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Department: {programme.department} &bull; Lead Agency: {programme.leadAgency}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/government/programmes/${id}/theory-of-change`}>
            <Button size="sm" variant="outline" className="text-xs h-8 px-3 gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Theory of Change
            </Button>
          </Link>
          <Link href={`/government/programmes/${id}/evaluation`}>
            <Button size="sm" className="text-xs h-8 px-3 gap-1">
              <FileText className="w-3.5 h-3.5" /> Impact Evaluation
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-subtle md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Operational Problem Statement</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
            <p>{programme.problemStatement}</p>
            <div className="pt-2">
              <span className="font-bold text-foreground block">Target Beneficiary Population:</span>
              <p>{programme.targetPopulationDescription}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Financial Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1">
              <span className="text-muted-foreground">Total Budget:</span>
              <span className="font-mono font-bold">₹{(programme.totalBudgetINR / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-muted-foreground">Utilized to Date:</span>
              <span className="font-mono font-bold text-emerald-600">₹{(programme.utilizedBudgetINR / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Burn Status:</span>
              <span className="font-bold text-foreground">On Plan (68.1%)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Key Performance Indicators (KPIs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programme.kpis?.map((kpi: any) => (
            <Card key={kpi.kpiId} className="shadow-subtle">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <Badge variant="success" className="text-[9px] mb-1">{kpi.status}</Badge>
                  <CardTitle className="text-sm font-bold">{kpi.metricName}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">{kpi.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-bold font-mono">{kpi.targetValue} {kpi.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Achieved:</span>
                  <span className="font-bold font-mono text-emerald-600">{kpi.currentValue} {kpi.unit}</span>
                </div>
                <p className="text-[10px] text-muted-foreground pt-1 border-t">
                  Source: {kpi.dataSource} &bull; Confidence: {kpi.confidence}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
