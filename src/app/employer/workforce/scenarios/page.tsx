"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, Layers, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function WorkforceScenariosPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/employer/workforce/scenarios")
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
              <Sparkles className="w-3.5 h-3.5 mr-1" /> WORKFORCE SCENARIO SIMULATOR
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Strategic Scenario Evaluation: Hire Direct vs Internal Reskill vs Automation
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Model cost, time-to-productivity, talent risk &amp; capacity ramp across strategic talent acquisition pathways
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => (
          <Card key={sc.scenarioId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">{sc.strategy}</Badge>
                  <Badge variant={sc.riskAssessment === "LOW" ? "success" : "warning"} className="text-[10px]">
                    Risk: {sc.riskAssessment}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{sc.scenarioName}</CardTitle>
                <CardDescription className="text-xs">
                  Target: {sc.projectedHeadcountNeed} Headcount ({sc.horizonMonths} Months)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <p className="text-muted-foreground leading-relaxed">{sc.skillDeficitSummary}</p>

                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Expenditure:</span>
                    <span className="font-mono font-bold text-foreground">₹{(sc.estimatedCostINR / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time to Full Productivity:</span>
                    <span className="font-mono font-bold text-foreground">{sc.timeToProductivityWeeks} Weeks</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-muted/30 border text-[11px] text-muted-foreground">
                  <strong>Risk Analysis:</strong> {sc.riskExplanation}
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0">
              <span className="text-[10px] text-muted-foreground italic block">
                {sc.disclaimer}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
