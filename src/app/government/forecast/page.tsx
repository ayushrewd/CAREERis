"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GovernmentForecastCommandCenterPage() {
  const [national, setNational] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/forecasts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setNational(res.data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Government Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">National Strategic Labour-Market Forecast Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Macro-level talent pipeline projections, regional demand imbalances &amp; policy intervention simulations
          </p>
        </div>
        <Link href="/government/scenarios">
          <Button size="sm" className="text-xs h-7 px-3 gap-1">
            <Sparkles className="w-3.5 h-3.5" /> What-If Policy Scenarios
          </Button>
        </Link>
      </div>

      {national && (
        <Card className="shadow-subtle border-primary/30">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px]">PAN-INDIA AGGREGATE</Badge>
                <CardTitle className="text-lg font-bold">12-Month Projected Labour Demand</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Empirical statistical confidence: {(national.confidenceScore * 100).toFixed(0)}%
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-emerald-600 block">
                {(national.forecastDemand / 100000).toFixed(2)} Lakh
              </span>
              <span className="text-[10px] text-muted-foreground">+{national.percentageChange}% projected 12M growth</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {national.projections?.map((p: any) => (
                <div key={p.date} className="p-3 rounded-xl border bg-card space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground block">{p.date} Forecast</span>
                  <span className="text-lg font-bold font-mono text-foreground block">
                    {(p.projectedDemand / 100000).toFixed(2)} Lakh
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    CI: [{(p.lowerConfidenceBound / 100000).toFixed(2)}L - {(p.upperConfidenceBound / 100000).toFixed(2)}L]
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Fast Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/insights/emerging-skills">
          <Card className="shadow-subtle hover:border-primary/40 transition-all p-4">
            <span className="font-bold text-foreground block text-sm">Emerging Skills Radar &rarr;</span>
            <p className="text-xs text-muted-foreground mt-1">Track high-growth skills in early acceleration.</p>
          </Card>
        </Link>
        <Link href="/insights/skill-risk">
          <Card className="shadow-subtle hover:border-primary/40 transition-all p-4">
            <span className="font-bold text-foreground block text-sm">Skill Obsolescence Radar &rarr;</span>
            <p className="text-xs text-muted-foreground mt-1">Review at-risk trades requiring curriculum modernization.</p>
          </Card>
        </Link>
        <Link href="/insights/alerts">
          <Card className="shadow-subtle hover:border-primary/40 transition-all p-4">
            <span className="font-bold text-foreground block text-sm">Early Warning Alerts &rarr;</span>
            <p className="text-xs text-muted-foreground mt-1">Inspect critical regional shortage and demand spikes.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
