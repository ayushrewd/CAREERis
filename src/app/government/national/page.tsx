"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, TrendingUp, AlertTriangle, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function NationalIntelligencePage() {
  const [national, setNational] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/government/national")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setNational(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!national) {
    return (
      <div className="p-8 text-center text-muted-foreground text-xs">
        Loading national intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Building2 className="w-3.5 h-3.5 mr-1" /> PAN-INDIA LABOUR INTELLIGENCE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            National Demand, Supply Deficits &amp; Strategic Skill Inventory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregated real-time metrics across 766 districts, 14,900+ ITIs &amp; verified candidate registries
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/government/simulations">
            <Sparkles className="w-3.5 h-3.5" /> Policy Simulator
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">Active National Demand</span>
          <span className="text-xl font-mono font-bold text-foreground block pt-1">
            {(national.totalActiveNationalDemand / 1000000).toFixed(2)}M Roles
          </span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">Verified Candidate Supply</span>
          <span className="text-xl font-mono font-bold text-primary block pt-1">
            {(national.totalVerifiedCandidateSupply / 1000000).toFixed(2)}M Candidates
          </span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">Net National Skill Gap</span>
          <span className="text-xl font-mono font-bold text-amber-600 block pt-1">
            {(national.netNationalSkillGap / 1000000).toFixed(2)}M Deficit
          </span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">National Placement Rate</span>
          <span className="text-xl font-mono font-bold text-emerald-600 block pt-1">
            {national.averageNationalPlacementRate}%
          </span>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading">Top High-Scarcity National Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {national.topDemandedSkillsPanIndia?.map((s: any) => (
            <Card key={s.skillName} className="shadow-subtle p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{s.skillName}</span>
                {s.isEmerging && <Badge variant="success" className="text-[10px]">EMERGING</Badge>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Demand:</span>
                  <span className="font-mono font-bold">{s.demandCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Supply:</span>
                  <span className="font-mono font-bold">{s.supplyCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Net Deficit:</span>
                  <span className="font-mono font-bold text-amber-600">-{s.gap.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
