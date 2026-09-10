"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft, ArrowRight, Activity, ShieldCheck, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

export default function ForecastsDashboardPage() {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState("12M");

  useEffect(() => {
    fetch("/api/intelligence/forecasts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setForecasts(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const national = forecasts[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/insights">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Labour Market Insights
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">National Labour-Market Predictive Forecasts</h1>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" /> 3M–36M Multi-Horizon
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Statistical &amp; ML projections with upper/lower confidence bounds &bull; Pan-India coverage
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {["3M", "6M", "12M", "24M", "36M"].map((h) => (
            <Button
              key={h}
              size="sm"
              variant={selectedHorizon === h ? "default" : "outline"}
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedHorizon(h)}
            >
              {h}
            </Button>
          ))}
        </div>
      </div>

      {/* National Overview Card */}
      {national && (
        <Card className="shadow-subtle border-primary/30 bg-gradient-to-r from-card via-card/95 to-primary/5">
          <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px]">
                  TREND: {national.trend}
                </Badge>
                <CardTitle className="text-base font-bold">{national.scopeEntityName}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Confidence Score: <span className="font-bold text-foreground font-mono">{(national.confidenceScore * 100).toFixed(0)}%</span> &bull; Horizon: {selectedHorizon}
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-emerald-600 block">
                {(national.forecastDemand / 100000).toFixed(2)} Lakh
              </span>
              <span className="text-[10px] text-muted-foreground">+{national.percentageChange}% projected 12M growth</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Projections Table with Confidence Bounds */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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

            {/* Drivers */}
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-muted-foreground block">Key Growth Drivers:</span>
              {national.majorDriverSignals?.map((d: string, idx: number) => (
                <p key={idx} className="text-[11px] text-muted-foreground">&bull; {d}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regional & Industry Forecasts List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Regional &amp; Cluster Forecast Dossiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecasts.slice(1).map((f) => (
            <Card key={f.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">{f.scope}</Badge>
                  <span className="text-xs font-mono font-bold text-emerald-600">+{f.percentageChange}%</span>
                </div>
                <CardTitle className="text-base font-bold pt-1">{f.scopeEntityName}</CardTitle>
                <CardDescription className="text-xs">
                  Current: {f.currentDemand?.toLocaleString()} &rarr; Projected: {f.forecastDemand?.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 rounded-lg border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Signal: {f.majorDriverSignals?.[0]}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
