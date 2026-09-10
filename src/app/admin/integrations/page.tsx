"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, ArrowRight, ShieldCheck, Database, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminIntegrationsPage() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/integrations")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setConnectors(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">External Integration &amp; Ingestion Connectors</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time synchronization status across Sector Skill Councils, NCVT/DGT registries, and Corporate filings
          </p>
        </div>
        <Link href="/admin/integrations/errors">
          <Button size="sm" variant="outline" className="text-xs h-7 px-3 gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Quarantine &amp; Conflicts
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {connectors.map((c) => (
          <Card key={c.integrationId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">✓ {c.status}</Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">{c.connectorType}</Badge>
                  <CardTitle className="text-base font-bold">{c.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Provider: {c.provider} &bull; Frequency: {c.frequency} &bull; Latency: {c.latencyMs}ms
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-emerald-600 block">
                  Quality: {c.dataQualityScore}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Last Sync: {new Date(c.lastSyncTimestamp).toLocaleTimeString()}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Received</span>
                  <span className="font-mono font-bold text-foreground">{c.recordsReceivedTotal?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Accepted &amp; Normalized</span>
                  <span className="font-mono font-bold text-emerald-600">{c.recordsAcceptedTotal?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Quarantined</span>
                  <span className="font-mono font-bold text-amber-500">{c.recordsQuarantinedTotal?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
