"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2, BookOpen, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function StateDetailPage() {
  const params = useParams();
  const stateCode = (params.id as string)?.toUpperCase();
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stateCode) {
      fetch(`/api/government/states/${stateCode}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setDossier(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [stateCode]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading state intelligence...</div>;
  if (!dossier?.state) return <div className="p-8 text-center text-sm text-muted-foreground">State not found.</div>;

  const { state, interventions, budgets, risks, priorities } = dossier;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government/states">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> All States
          </Button>
        </Link>
      </div>

      {/* State Header Banner */}
      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{state.stateName}</h1>
            <Badge variant="outline" className="text-xs font-mono">{state.stateCode}</Badge>
            <Badge variant={state.priorityCategory === "CRITICAL" ? "destructive" : "warning"} className="text-xs">
              {state.priorityCategory} Priority
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Capital: {state.capitalCity} &bull; {state.totalDistrictsCount} Districts &bull; {state.totalIndustrialClustersCount} Industrial Hubs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/government/districts?stateCode=${state.stateCode}`}>
            <Button size="sm" variant="outline" className="text-xs">
              District Matrix
            </Button>
          </Link>
          <Link href={`/government/interventions?stateCode=${state.stateCode}`}>
            <Button size="sm" className="text-xs">
              Interventions ({interventions.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* State Metric Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Annual Demand</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {state.annualEmployerDemand?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-600">Enterprise Requisitions</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Verified Supply</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {state.annualVerifiedSupply?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground">Skill Passport Holders</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Net Deficit Gap</span>
            <span className="text-2xl font-bold font-mono text-rose-600 block">
              -{state.netSkillGap?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-rose-600">Shortage Across Industries</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Placement Rate</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {state.averagePlacementRatePercentage}%
            </span>
            <span className="text-[10px] text-muted-foreground">Verified Outcomes</span>
          </CardContent>
        </Card>
      </div>

      {/* Active State Interventions & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Active Government Interventions</CardTitle>
            <CardDescription className="text-xs">Executed under state skill mission &amp; central schemes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {interventions.length === 0 ? (
              <p className="text-muted-foreground">No active interventions found for {state.stateName}.</p>
            ) : (
              interventions.map((inv: any) => (
                <div key={inv.id} className="p-3 rounded-xl border bg-card space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">{inv.title}</span>
                    <Badge variant="outline" className="text-[9px]">{inv.status}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{inv.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                    <span>Target: {inv.targetValue} {inv.metricName}</span>
                    <span className="font-mono font-bold text-foreground">{formatCurrencyINR(inv.budgetINR)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">District Risk Signals</CardTitle>
            <CardDescription className="text-xs">Identified early warning alerts &amp; institutional deficits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {risks.length === 0 ? (
              <p className="text-muted-foreground">No high severity risks flagged for {state.stateName}.</p>
            ) : (
              risks.map((r: any) => (
                <div key={r.id} className="p-3 rounded-xl border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">{r.districtName}: {r.title}</span>
                    <Badge variant={r.severity === "CRITICAL" ? "destructive" : "warning"} className="text-[9px]">
                      {r.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{r.evidence}</p>
                  <p className="text-[10px] text-primary pt-0.5">&bull; {r.suggestedAction}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
