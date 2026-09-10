"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft, Play, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentScenariosPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [seatDelta, setSeatDelta] = useState<number>(30);
  const [targetSkill, setTargetSkill] = useState("skill-bms");

  useEffect(() => {
    fetch("/api/government/scenarios/simulate")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setScenarios(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/government/scenarios/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: `What-If Simulation (${seatDelta > 0 ? "+" : ""}${seatDelta}% Seat Capacity for ${targetSkill})`,
          geographyScope: "DISTRICT",
          stateCode: "MH",
          targetSkillId: targetSkill,
          adjustments: {
            trainingSeatCapacityDeltaPercent: seatDelta,
            employerCoEApprenticeshipCreated: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScenarios([data.data, ...scenarios]);
      }
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">What-If Policy Scenario Simulator</h1>
            <Badge variant="warning" className="text-xs font-mono">LABEL: SIMULATION</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate policy levers (+seats, +trainers, lab upgrades, apprenticeships) before committing public funds
          </p>
        </div>
      </div>

      {/* Simulator Control Panel */}
      <Card className="shadow-subtle border-primary/30 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Configure Simulation Levers</CardTitle>
          <CardDescription className="text-xs">
            Adjust capacity parameters to project talent output, deficit reduction, and cost ROI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Target Skill Domain</label>
              <select
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border bg-background"
              >
                <option value="skill-bms">Battery Management Systems (BMS)</option>
                <option value="skill-5axis-cnc">5-Axis CNC Precision Machining</option>
                <option value="skill-ai-edge">Edge AI &amp; Embedded Firmware</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Seat Capacity Delta (%): {seatDelta}%</label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={seatDelta}
                onChange={(e) => setSeatDelta(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSimulate} disabled={simulating} className="w-full text-xs h-9 gap-1.5 shadow-md">
                <Play className="w-3.5 h-3.5" />
                {simulating ? "Simulating..." : "Run Policy Simulation"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-heading">Simulation Runs (Explicitly Marked: SIMULATION)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scen) => (
            <Card key={scen.scenarioId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" className="text-[9px] font-mono">SIMULATION</Badge>
                  <span className="text-[10px] text-muted-foreground">Confidence: {Math.round(scen.confidence * 100)}%</span>
                </div>
                <CardTitle className="text-sm font-bold pt-1">{scen.scenarioTitle}</CardTitle>
                <CardDescription className="text-[11px] text-amber-600 dark:text-amber-400">
                  {scen.disclaimer}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg border bg-muted/20">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Baseline Supply</span>
                    <span className="font-mono font-semibold">{scen.baseline.supply?.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] text-muted-foreground block">Gap: {scen.baseline.netGap}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Projected Supply</span>
                    <span className="font-mono font-bold text-emerald-600">{scen.projected.supply?.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] text-emerald-600 block font-semibold">Gap: {scen.projected.netGap}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-primary/5 space-y-1">
                  <span className="text-[10px] font-bold text-primary block">Projected Impact:</span>
                  <p className="text-[11px] text-muted-foreground">{scen.impactSummary}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold pt-0.5">&bull; {scen.roiAssessment}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
