"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, ArrowRight, Search, Plus, ShieldCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/government/programs")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPrograms(res.data || []);
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
          <h1 className="text-xl font-bold font-heading">Government Schemes &amp; Program Governance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pan-India monitoring of central &amp; state skilling missions, enrollment, and placement KPIs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog) => (
          <Card key={prog.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">{prog.schemeName}</Badge>
                <Badge variant="success" className="text-[10px]">{prog.status}</Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{prog.name}</CardTitle>
              <CardDescription className="text-xs">{prog.department} &bull; Lead: {prog.leadAgency}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg border bg-muted/20">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Allocated Budget</span>
                  <span className="font-bold text-foreground font-mono">{formatCurrencyINR(prog.budgetAllocatedINR)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Placed Beneficiaries</span>
                  <span className="font-bold text-emerald-600 font-mono">{prog.placedCount?.toLocaleString("en-IN")} Placed</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground block">Program Key Performance Indicators:</span>
                {prog.kpis?.map((kpi: any) => (
                  <div key={kpi.kpiId} className="flex items-center justify-between text-[11px] p-1.5 rounded border bg-card">
                    <span className="text-muted-foreground">{kpi.name}</span>
                    <Badge variant={kpi.status === "ACHIEVED" ? "success" : "default"} className="text-[9px]">
                      {kpi.currentValue} / {kpi.targetValue} {kpi.unit} ({kpi.status})
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="text-muted-foreground">Scope: {prog.scopeType}</span>
                <Link href={`/government/programs/${prog.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    Full Program Dossier <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
