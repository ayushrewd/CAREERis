"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, Layers, TrendingUp } from "lucide-react";

export default function PolicySimulationsPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/government/simulations")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setScenarios(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> POLICY SCENARIO SIMULATOR
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Modelled What-If Policy Interventions &amp; Budget Optimization
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulate seat expansions, trainer fast-track retraining &amp; lab modernization impact prior to public fund commitment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => (
          <Card key={sc.scenarioId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">{sc.scenarioType}</Badge>
                  <Badge variant="success" className="text-[10px]">
                    Confidence: {sc.confidenceScore}%
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{sc.title}</CardTitle>
                <CardDescription className="text-xs">
                  Scope: {sc.scopeGeography} &bull; Time to Impact: {sc.timeToImpactWeeks} Weeks
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <p className="text-muted-foreground leading-relaxed">{sc.description}</p>

                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Budget:</span>
                    <span className="font-mono font-bold text-foreground">₹{(sc.estimatedCostINR / 10000000).toFixed(2)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity Expansion:</span>
                    <span className="font-mono font-bold text-foreground">{sc.baselineSeats.toLocaleString()} &rarr; {sc.simulatedSeats.toLocaleString()} Seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skill Gap Reduction:</span>
                    <span className="font-mono font-bold text-emerald-600">-{sc.projectedSkillGapReductionPercentage}%</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-muted/30 border text-[11px] text-muted-foreground">
                  <strong>Risk Assessment:</strong> {sc.riskAnalysis}
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0">
              <span className="text-[10px] text-muted-foreground italic block">
                * Modelled projection based on DGT capacity absorption rates. Requires formal sanction.
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
