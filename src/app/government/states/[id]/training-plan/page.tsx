"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Landmark, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function StateTrainingPlanPage() {
  const params = useParams();
  const id = params.id as string;
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/training/plans/state/${id}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setPlan(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading state training plan...</div>;
  if (!plan) return <div className="p-8 text-center text-sm text-muted-foreground">Training plan not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href={`/government/states/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> State Intelligence Dossier
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{plan.name}</h1>
            <Badge variant="outline" className="text-xs">{plan.planPeriod}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Aggregated state-level vocational training capacity &amp; multi-district ITI modernizations
          </p>
        </div>
      </div>

      {/* Top 4 Plan Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Target Annual Placements</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {plan.expectedAnnualPlacedGraduates?.toLocaleString()} Placements
            </span>
            <span className="text-[10px] text-muted-foreground">Statewide VET Output</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Faculty Shortage Gap</span>
            <span className="text-2xl font-bold font-mono text-amber-600 block">
              {plan.trainerShortageCount} Instructors
            </span>
            <span className="text-[10px] text-muted-foreground">Across All State ITIs</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Lab Modernization Outlay</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {formatCurrencyINR(plan.equipmentUpgradeBudgetINR)}
            </span>
            <span className="text-[10px] text-primary font-semibold">Technical Upgrades</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Statewide Capex Budget</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {formatCurrencyINR(plan.totalRecommendedInvestmentINR)}
            </span>
            <span className="text-[10px] text-muted-foreground">Recommended Fund</span>
          </CardContent>
        </Card>
      </div>

      {/* Priority Skills & Seat Requirements */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">State Strategic Skill Deficits</CardTitle>
          <CardDescription className="text-xs">Capacity vs state employer demand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-2">
            {plan.prioritySkills?.map((sk: any) => (
              <div key={sk.skillId} className="p-3 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-foreground block text-sm">{sk.skillName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    Current Statewide Capacity: {sk.currentSeats} Seats &bull; Required: {sk.requiredSeats} Seats
                  </span>
                </div>
                <Badge variant="destructive" className="text-xs font-mono self-start sm:self-center">
                  Gap: -{sk.gap} Seats
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
