"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function TrainingActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/actions")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setActions(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Training Provider Operational Action Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prioritized tactical interventions: curriculum modernizations, trainer retraining &amp; equipment procurement
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((act) => (
          <Card key={act.id} className="shadow-subtle border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={act.priority === "CRITICAL" ? "destructive" : "warning"} className="text-[10px]">
                  {act.priority} PRIORITY
                </Badge>
                <span className="text-xs font-mono font-bold text-foreground">
                  Budget: {formatCurrencyINR(act.estimatedCostINR)}
                </span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{act.title}</CardTitle>
              <CardDescription className="text-xs">{act.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Empirical Evidence:</span>
                <p className="text-[11px] text-muted-foreground">{act.evidence}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-[11px] text-emerald-600 font-medium">Expected: {act.expectedOutcome}</span>
                <Button size="sm" className="text-xs h-7 px-3">Execute Action</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
