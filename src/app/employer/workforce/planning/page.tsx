"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, AlertTriangle, ArrowRight, Layers, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function WorkforcePlanningPage() {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/employer/workforce/forecasts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setForecasts(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> WORKFORCE PLANNING &amp; FORECASTING
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Headcount Demand &amp; Skill Deficit Projections
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configurable 3, 6, and 12-month projections: Capacity vs Attrition vs Net Hiring Deficit
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/employer/workforce/scenarios">
            <Sparkles className="w-3.5 h-3.5" /> Launch Scenario Simulator
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecasts.map((f) => (
          <Card key={f.horizonMonths} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {f.horizonMonths}-Month Forecast
                </Badge>
                <span className="text-xs font-mono font-bold text-primary">
                  Net Gap: +{f.netHeadcountGap}
                </span>
              </div>
              <CardTitle className="text-base font-bold pt-1">
                Demand: {f.projectedHeadcountDemand} Headcount
              </CardTitle>
              <CardDescription className="text-xs">
                Capacity: {f.currentWorkforceCapacity} &bull; Projected Attrition: {f.projectedAttrition}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="font-bold text-foreground text-[11px] block">Critical Skill Deficits:</span>
                {f.criticalSkillGaps?.map((gap: any) => (
                  <div key={gap.skillName} className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">{gap.skillName}:</span>
                    <span className="font-mono font-bold text-foreground">-{gap.missingHeadcount}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-muted-foreground pt-1">
                <span>Recommended Budget:</span>
                <span className="font-mono font-bold text-foreground">₹{(f.recommendedBudgetINR / 100000).toFixed(1)} Lakhs</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
