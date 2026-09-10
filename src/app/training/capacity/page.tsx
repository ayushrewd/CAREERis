"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft, ArrowRight, Play, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function TrainingCapacityPage() {
  const [overview, setOverview] = useState<any>(null);
  const [scenarioResult, setScenarioResult] = useState<any>(null);
  const [delta, setDelta] = useState(25);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch("/api/training/capacity")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOverview(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRunScenario = async (percent: number) => {
    setRunning(true);
    setDelta(percent);
    try {
      const res = await fetch("/api/training/capacity/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaPercentage: percent, targetSkillId: "Battery Management Systems (BMS)" }),
      });
      const data = await res.json();
      if (data.success) setScenarioResult(data.data);
    } finally {
      setRunning(false);
    }
  };

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
          <h1 className="text-xl font-bold font-heading">Pan-India Training Capacity &amp; Seat Planning Engine</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Geographic seat distribution, utilization rates, and dynamic capacity expansion simulation models
          </p>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">National Sanctioned Seats</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {(overview?.totalSanctionedSeats / 100000).toFixed(1)} Lakh
            </span>
            <span className="text-[10px] text-primary font-semibold">Across All ITIs &amp; Polytechnics</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Active Enrolled Trainees</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {(overview?.totalActiveEnrolled / 100000).toFixed(1)} Lakh
            </span>
            <span className="text-[10px] text-muted-foreground">{overview?.averageSeatUtilizationPercentage}% Seat Utilization</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Vocational Trainers</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 block">
              {overview?.totalActiveTrainers?.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">Active Certified Instructors</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Technical Labs</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {overview?.totalTechnicalLabs?.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">Operational Workstation Bays</span>
          </CardContent>
        </Card>
      </div>

      {/* Seat Planning & Capacity Scenario Simulator */}
      <Card className="shadow-subtle border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold">Interactive Seat Capacity Scenario Simulator</CardTitle>
              <CardDescription className="text-xs">
                Simulate output, trainer requirement, and budget signals for capacity scaling
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant={delta === 10 ? "default" : "outline"} className="text-xs h-7 px-2.5" onClick={() => handleRunScenario(10)}>+10%</Button>
              <Button size="sm" variant={delta === 25 ? "default" : "outline"} className="text-xs h-7 px-2.5" onClick={() => handleRunScenario(25)}>+25%</Button>
              <Button size="sm" variant={delta === 50 ? "default" : "outline"} className="text-xs h-7 px-2.5" onClick={() => handleRunScenario(50)}>+50%</Button>
            </div>
          </div>
        </CardHeader>
        {scenarioResult && (
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[10px] font-mono font-bold">
                {scenarioResult.label}
              </Badge>
              <span className="text-xs font-semibold text-foreground">{scenarioResult.scenarioName}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Projected Seats</span>
                <span className="text-lg font-bold text-foreground font-mono">{scenarioResult.projectedSeats} Seats</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Expected Placements</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">{scenarioResult.projectedPlacements} Hires</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Additional Trainers</span>
                <span className="text-lg font-bold text-indigo-600 font-mono">+{scenarioResult.additionalTrainersRequired} Faculty</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Est. Additional Cost</span>
                <span className="text-lg font-bold text-foreground font-mono">{formatCurrencyINR(scenarioResult.additionalLabCostINR)}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
