"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Sparkles, Clock, CheckCircle2, MapPin } from "lucide-react";

export default function GovernmentAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/government/alerts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setAlerts(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> POLICY EARLY WARNING SYSTEM
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Real-Time Capacity Crises, Equipment Deficits &amp; Acute Scarcity Alerts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated signals triggered by employer hiring spikes, lab breakdowns &amp; sudden enrollment declines
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alt) => (
          <Card key={alt.alertId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={alt.severity === "CRITICAL" ? "destructive" : "warning"} className="text-[10px] font-mono">
                    {alt.severity}
                  </Badge>
                  <CardTitle className="text-base font-bold">{alt.title}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> {alt.cluster ? `${alt.cluster} &bull; ` : ""}{alt.district ? `${alt.district}, ` : ""}{alt.state}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {new Date(alt.timestamp).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-[10px]">{alt.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground">{alt.description}</p>
              <div className="p-2 rounded bg-muted/30 border text-[11px] text-muted-foreground">
                <strong>Evidence Source:</strong> {alt.evidenceSource}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
