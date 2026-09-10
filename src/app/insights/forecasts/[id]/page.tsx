"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";

export default function ForecastDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/intelligence/forecasts`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            const found = res.data.find((f: any) => f.id === id) || res.data[0];
            setForecast(found);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading forecast detail...</div>;
  if (!forecast) return <div className="p-8 text-center text-sm text-muted-foreground">Forecast not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/insights/forecasts">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> All Forecasts
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{forecast.scopeEntityName}</h1>
            <Badge variant="success" className="text-xs">{forecast.trend}</Badge>
            <Badge variant="outline" className="text-xs font-mono">{forecast.forecastHorizon}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Scope: {forecast.scope} &bull; Confidence Score: {(forecast.confidenceScore * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Multi-Horizon Projections &amp; Uncertainty Range</CardTitle>
          <CardDescription className="text-xs">Statistically modeled upper and lower bounds</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {forecast.projections?.map((p: any) => (
            <div key={p.date} className="p-3 rounded-xl border bg-card space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground block">{p.date} Forecast</span>
              <span className="text-lg font-bold font-mono text-foreground block">
                {p.projectedDemand?.toLocaleString()}
              </span>
              <span className="text-[9px] text-muted-foreground block">
                CI: [{p.lowerConfidenceBound?.toLocaleString()} - {p.upperConfidenceBound?.toLocaleString()}]
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
