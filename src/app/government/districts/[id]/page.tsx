"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2, Zap, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function DistrictActionCenterPage() {
  const params = useParams();
  const districtId = params.id as string;
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtId) {
      fetch(`/api/government/districts/${districtId}/action-plan`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setDossier(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [districtId]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading district action dossier...</div>;
  if (!dossier) return <div className="p-8 text-center text-sm text-muted-foreground">District not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government/districts">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> District Matrix
          </Button>
        </Link>
      </div>

      {/* District Header Banner */}
      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{dossier.districtName} District Action Center</h1>
            <Badge variant="outline" className="text-xs font-mono">{dossier.stateCode}</Badge>
            <Badge variant={dossier.priorityCategory === "CRITICAL" ? "destructive" : "warning"} className="text-xs">
              {dossier.priorityCategory} Priority ({dossier.priorityScore}/100)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {dossier.industrialCluster} &bull; State: {dossier.stateName} &bull; Confidence: {Math.round(dossier.confidenceScore * 100)}%
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/government/scenarios?districtId=${dossier.districtId}`}>
            <Button size="sm" variant="outline" className="text-xs gap-1">
              Simulate Scenario
            </Button>
          </Link>
          <Link href={`/government/interventions?districtId=${dossier.districtId}`}>
            <Button size="sm" className="text-xs gap-1">
              Propose Action
            </Button>
          </Link>
        </div>
      </div>

      {/* Core Question Callout */}
      <Card className="shadow-subtle border-primary/30 bg-gradient-to-r from-card via-card/95 to-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-[10px]">Action Intelligence</Badge>
            <CardTitle className="text-base font-bold">What Should {dossier.districtName} Do Next?</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Evidence-grounded sequential policy actions ranked by return-on-investment &amp; deficit closure impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.whatShouldThisDistrictDoNext?.map((act: any) => (
            <div key={act.priorityRank} className="p-4 rounded-xl border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {act.priorityRank}
                  </span>
                  <span className="font-bold text-xs text-foreground">{act.actionTitle}</span>
                  <Badge variant="outline" className="text-[9px]">{act.suggestedInterventionType}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{act.evidence}</p>
                <div className="flex items-center gap-4 text-[10px] text-emerald-600 font-medium pt-1">
                  <span>&bull; Expected Impact: {act.expectedOutcome}</span>
                  <span>&bull; Est. Budget: {formatCurrencyINR(act.estimatedBudgetINR)}</span>
                </div>
              </div>

              <Link href={`/government/interventions`}>
                <Button size="sm" className="text-xs h-8 px-3 whitespace-nowrap self-end md:self-center">
                  Execute Intervention
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* District Metrics Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Annual Demand</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {dossier.summaryMetrics.totalAnnualDemand?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground">Local Vacancies</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Verified Supply</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {dossier.summaryMetrics.totalVerifiedSupply?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground">Certified Passports</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Training Capacity</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {dossier.summaryMetrics.trainingCapacitySeats?.toLocaleString("en-IN")} Seats
            </span>
            <span className="text-[10px] text-muted-foreground">{dossier.summaryMetrics.seatUtilizationPercentage}% Seat Utilization</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Placement Rate</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 block">
              {dossier.summaryMetrics.averagePlacementRatePercentage}%
            </span>
            <span className="text-[10px] text-muted-foreground">Verified Employment</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
