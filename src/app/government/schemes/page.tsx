"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BookOpen, AlertTriangle, CheckCircle2, Award, Building2 } from "lucide-react";

export default function SchemesIntelligencePage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/government/schemes")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSchemes(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> SCHEME INTELLIGENCE &amp; COVERAGE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            National Skill Schemes, Budget Expenditure &amp; Coverage Gaps
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate fund utilization, placement effectiveness &amp; policy blind spots across PMKVY, NAPS, and STRIVE
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {schemes.map((sc) => (
          <Card key={sc.schemeId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={sc.policyCoverageStatus === "POLICY_COVERAGE_GAP" ? "warning" : "success"} className="text-[10px] font-mono">
                    {sc.policyCoverageStatus}
                  </Badge>
                  <CardTitle className="text-base font-bold">{sc.name}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5">
                  Dept: <span className="font-bold text-foreground">{sc.department}</span> &bull; Target: {sc.targetDemographic}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-primary block">
                  ₹{(sc.spentBudgetINR / 10000000).toFixed(1)} Cr / ₹{(sc.allocatedBudgetINR / 10000000).toFixed(1)} Cr Spent
                </span>
                <span className="text-[10px] text-muted-foreground">Placement: {sc.placementRatePercentage}%</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground mr-1">Aligned Skills:</span>
                {sc.alignedSkills?.map((s: string) => (
                  <Badge key={s} variant="outline" className="text-[9px]">{s}</Badge>
                ))}
              </div>

              {sc.gapExplanation && (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-[11px]">
                  <strong>Policy Coverage Gap:</strong> {sc.gapExplanation}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
