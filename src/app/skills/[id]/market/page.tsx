"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  MapPin,
  ShieldAlert,
  ArrowLeft,
  Info,
  CheckCircle2,
  FileCheck2,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function SkillMarketPage() {
  const params = useParams();
  const skillId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillId) return;

    fetch(`/api/skills/${skillId}/market`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) {
          setData(resData.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [skillId]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-muted-foreground">Loading Labour Market Signals...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold font-heading">Market Data Unavailable</h2>
        <Link href="/skills">
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Skills</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Link href={`/skills/${skillId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Skill Dossier</span>
          </Button>
        </Link>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs font-semibold text-foreground">Labour Market Intelligence</span>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-indigo-50/50 via-primary/5 to-background dark:from-slate-900 dark:via-background dark:to-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Labour Market Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-foreground">
              Market Demand &amp; Supply: {data.skillName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time triangulation of enterprise hiring requisitions against technical training capacity.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge variant="warning" className="text-xs font-mono font-bold">
              {data.demandMetrics.trend.replace(/_/g, " ")}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">
              Model Confidence: {Math.round(data.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/30 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Annual Employer Demand</span>
            <div className="text-2xl font-extrabold font-heading text-foreground">
              {data.demandMetrics.annualEmployerDemandUnits.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">units/yr</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              ↑ 18.4% YoY Expansion
            </span>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/30 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">De-duplicated Supply</span>
            <div className="text-2xl font-extrabold font-heading text-foreground">
              {data.supplyMetrics.totalDeDuplicatedSupply.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">units/yr</span>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              ITI Seats: {data.supplyMetrics.activeItiTrainingSeats} • Candidates: {data.supplyMetrics.totalCandidateSupply}
            </span>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Net Annual Deficit</span>
            <div className="text-2xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
              +{data.netGap.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">shortage</span>
            </div>
            <span className="text-[10px] text-amber-600 font-semibold block">
              Demand-to-Supply Ratio: {data.gapRatio}x
            </span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Verified Assessment Rate</span>
            <div className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
              {Math.round((data.supplyMetrics.verifiedAssessmentHolders / Math.max(1, data.supplyMetrics.totalCandidateSupply)) * 100)}%
            </div>
            <span className="text-[10px] text-muted-foreground block">
              {data.supplyMetrics.verifiedAssessmentHolders} verified badge holders
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Regional Corridors & Hiring Industry Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              High-Deficit Industrial Geographies
            </h3>
            <div className="space-y-2 pt-1">
              {data.demandMetrics.topGeographies.map((geo: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg border bg-muted/30 text-xs flex items-center justify-between">
                  <span className="font-semibold text-foreground">{geo}</span>
                  <Badge variant="warning" className="text-[10px]">Priority Deficit</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Key Demand Sectors &amp; Active Hiring Units
            </h3>
            <div className="space-y-2 pt-1">
              {data.activeHiringEmployers.map((emp: any) => (
                <div key={emp.id} className="p-2.5 rounded-lg border bg-muted/30 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground block">{emp.name}</span>
                    <span className="text-[10px] text-muted-foreground">{emp.location} Cluster</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Active Hiring</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Provenance & Methodology */}
      <div className="p-4 rounded-xl border bg-card text-xs space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-bold text-foreground">Data Provenance &amp; Verification Methodology</h4>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {data.provenance.methodology}. Data refreshed on {new Date(data.provenance.lastComputed).toLocaleDateString("en-IN")}.
          {data.provenance.isSyntheticPilotData && (
            <span className="block mt-1 text-amber-700 dark:text-amber-400 font-medium">
              Notice: Figures are derived from the SIH Pilot Environment (Maharashtra &amp; Pan-India Industrial Corridors).
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
