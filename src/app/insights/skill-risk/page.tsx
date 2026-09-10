"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SkillRiskPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/skill-risk")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRisks(res.data || []);
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
          <h1 className="text-xl font-bold font-heading">Skill Obsolescence Risk &amp; Substitution Pathways</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detecting declining trades, automation displacement &amp; validated skill substitution bridges
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {risks.map((r) => (
          <Card key={r.skillId} className="shadow-subtle border-destructive/20 hover:border-destructive/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="destructive" className="text-[10px]">
                  RISK: {r.obsolescenceRisk?.level}
                </Badge>
                <span className="text-xs font-mono font-bold text-destructive">{r.growthRatePercentage}% YoY Decline</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{r.skillName}</CardTitle>
              <CardDescription className="text-xs">{r.categoryName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Observed Decline Signals:</span>
                {r.obsolescenceRisk?.signals?.map((s: string, idx: number) => (
                  <p key={idx} className="text-[11px] text-muted-foreground">&bull; {s}</p>
                ))}
              </div>

              {r.obsolescenceRisk?.potentialSubstitutes?.length > 0 && (
                <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Recommended Substitute Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.obsolescenceRisk.potentialSubstitutes.map((sub: any) => (
                      <Badge key={sub.skillId} variant="success" className="text-[10px]">
                        &rarr; {sub.skillName} ({(sub.similarityScore * 100).toFixed(0)}% Similarity)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
