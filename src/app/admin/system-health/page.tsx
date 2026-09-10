"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft, CheckCircle2, ShieldCheck, Server, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminSystemHealthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    fetch("/api/v1/system/health")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const services = data?.services || [];
  const summary = data?.summary;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">System Observability &amp; Infrastructure Health</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time status of database clusters, edge API gateways, worker queues &amp; external connectors
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchHealth} className="text-xs h-7 px-3 gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </Button>
      </div>

      {summary && (
        <Card className="shadow-subtle border-emerald-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">SYSTEM STATUS: {summary.status}</Badge>
              <CardTitle className="text-base font-bold">
                {summary.healthyServices} / {summary.totalServices} Infrastructure Components Operating Normally
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s: any) => (
          <Card key={s.serviceName} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={s.status === "HEALTHY" ? "success" : "destructive"} className="text-[10px]">
                  {s.status}
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground">Uptime: {s.uptimePercentage}%</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{s.serviceName}</CardTitle>
              <CardDescription className="text-xs">
                Latency: <span className="font-mono font-bold text-foreground">{s.latencyMs}ms</span> &bull; Checked: {new Date(s.lastCheckedAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>{s.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
