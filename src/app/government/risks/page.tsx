"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CANONICAL_PROGRAMME_RISKS } from "@/data/canonicalProgrammeOperationsData";

export default function ProgrammeRisksPage() {
  const risks = CANONICAL_PROGRAMME_RISKS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Programme Risk Register &amp; 5x5 Heatmap</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational and strategic risk governance: Probability &times; Impact scoring, early mitigation strategies &amp; owner review cycles
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {risks.map((r) => (
          <Card key={r.riskId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "MITIGATED" ? "success" : "warning"} className="text-[10px]">
                    {r.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                  <CardTitle className="text-base font-bold">{r.riskTitle}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Owner: <span className="font-bold text-foreground">{r.ownerName}</span> &bull; Review: {new Date(r.reviewDate).toLocaleDateString()}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-500 block">
                  Risk Score: {r.riskScore}/25
                </span>
                <span className="text-[10px] text-muted-foreground">
                  (Prob {r.probability} &times; Imp {r.impact})
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="font-bold text-foreground text-[11px] block">Active Mitigation Strategy:</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {r.mitigationStrategy}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
