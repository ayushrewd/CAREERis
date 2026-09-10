"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, ArrowRight, Search, Plus, Filter, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentInterventionsPage() {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useEffect(() => {
    const url = selectedStatus === "ALL" ? "/api/government/interventions" : `/api/government/interventions?status=${selectedStatus}`;
    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setInterventions(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [selectedStatus]);

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
          <h1 className="text-xl font-bold font-heading">Government Policy Interventions (11-Stage Lifecycle)</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full audit tracking from PROPOSED to EVALUATED with baseline, target, and actual metrics
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PROPOSED", "APPROVED", "FUNDED", "IN_PROGRESS", "COMPLETED"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={selectedStatus === st ? "default" : "outline"}
              className="text-xs h-8"
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interventions.map((inv) => (
          <Card key={inv.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">{inv.type}</Badge>
                <Badge
                  variant={inv.status === "COMPLETED" ? "success" : inv.status === "IN_PROGRESS" ? "default" : "warning"}
                  className="text-[10px]"
                >
                  {inv.status}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{inv.title}</CardTitle>
              <CardDescription className="text-xs">
                {inv.districtName}, {inv.stateName} &bull; Agency: {inv.responsibleAgency}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <p className="text-[11px] text-muted-foreground">{inv.description}</p>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Baseline</span>
                  <span className="font-bold text-foreground">{inv.baselineValue}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Target</span>
                  <span className="font-bold text-primary">{inv.targetValue}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Actual</span>
                  <span className="font-bold text-emerald-600">{inv.actualValue || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="font-mono font-bold text-foreground">{formatCurrencyINR(inv.budgetINR)}</span>
                <span className="text-emerald-600 font-bold">{inv.achievementPercentage || 0}% Achieved</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
