"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, ShieldAlert, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function PredictiveAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/alerts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setAlerts(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-xl font-bold font-heading">Predictive Early Warning System &amp; Signal Fusion</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated detection of demand spikes, skill scarcity, oversupply bottlenecks &amp; curriculum deterioration
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((al) => (
          <Card key={al.alertId} className="shadow-subtle border-amber-500/30 hover:border-amber-500/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={al.severity === "CRITICAL" ? "destructive" : "warning"} className="text-[10px]">
                  {al.severity} SEVERITY
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Signal Fusion: <strong className="text-foreground">{al.signalFusionStatus}</strong> ({(al.confidenceScore * 100).toFixed(0)}% Confidence)
                </span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{al.trigger}</CardTitle>
              <CardDescription className="text-xs">{al.affectedGeography}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Empirical Evidence:</span>
                <p className="text-[11px] text-muted-foreground">{al.evidenceData}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-[11px] text-emerald-600 font-medium">Intervention: {al.recommendedIntervention}</span>
                <Link href="/government/interventions">
                  <Button size="sm" className="text-xs h-7 px-3">Review Policy Action</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
