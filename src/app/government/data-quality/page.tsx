"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, AlertCircle, Database, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GovernmentDataQualityPage() {
  const [quality, setQuality] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/government/data-quality")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setQuality(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Data Quality &amp; Conflict Detection Governance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent data provenance, multi-source triangulation reliability, and conflicting signal resolution
          </p>
        </div>
      </div>

      {quality && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-subtle">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">National Completeness</span>
                <span className="text-2xl font-bold font-mono text-emerald-600 block">
                  {quality.nationalCompletenessScore}%
                </span>
                <span className="text-[10px] text-muted-foreground">High coverage</span>
              </CardContent>
            </Card>
            <Card className="shadow-subtle">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Freshness Latency</span>
                <span className="text-2xl font-bold font-mono text-primary block">
                  {quality.freshnessAverageHours} Hours
                </span>
                <span className="text-[10px] text-muted-foreground">Rolling sync</span>
              </CardContent>
            </Card>
            <Card className="shadow-subtle">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Duplicate Record Rate</span>
                <span className="text-2xl font-bold font-mono text-foreground block">
                  {quality.duplicateRecordRatePercentage}%
                </span>
                <span className="text-[10px] text-emerald-600">Deduplicated</span>
              </CardContent>
            </Card>
            <Card className="shadow-subtle">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Unresolved Skills in Quarantine</span>
                <span className="text-2xl font-bold font-mono text-amber-600 block">
                  {quality.unresolvedSkillCount}
                </span>
                <span className="text-[10px] text-muted-foreground">Awaiting ontology mapping</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Source Reliability Rankings</CardTitle>
                <CardDescription className="text-xs">Weighted scoring based on historical verification accuracy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                {quality.sourceReliabilityScores?.map((s: any) => (
                  <div key={s.sourceName} className="p-3 rounded-xl border bg-card flex items-center justify-between">
                    <span className="font-semibold text-foreground">{s.sourceName}</span>
                    <Badge variant="success" className="text-[10px]">
                      {s.reliabilityScore}% Reliability
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Conflicting Signals Detected &amp; Resolved</CardTitle>
                <CardDescription className="text-xs">Multi-source evidence fusion resolving discrepancies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {quality.conflictingSignalsDetected?.map((c: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{c.metric}</span>
                      <Badge variant="outline" className="text-[9px]">{c.resolutionStatus}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded border bg-muted/20">
                      <div>
                        <span className="text-muted-foreground block">{c.sourceA.name}</span>
                        <span className="font-mono font-bold text-foreground">{c.sourceA.value}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">{c.sourceB.name}</span>
                        <span className="font-mono font-bold text-foreground">{c.sourceB.value}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Probable Cause: {c.probableCause}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">&bull; Fused Final Value: {c.fusedValue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
