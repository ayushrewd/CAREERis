"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, PieChart } from "lucide-react";
import Link from "next/link";

export default function GovernmentBudgetsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/budgets")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;
  const budgets = data?.budgets || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Funding &amp; Budget Intelligence Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-tier funding source reconciliation, expenditure burn rates, budget line variances &amp; cost-per-outcome metrics
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Total Allocation</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-primary">
                ₹{(summary.totalAllocatedINR / 10000000).toFixed(1)} Cr
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Committed Tranches</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-foreground">
                ₹{(summary.totalCommittedINR / 10000000).toFixed(1)} Cr
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Actual Expenditure</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-emerald-600">
                ₹{(summary.totalUtilizedINR / 10000000).toFixed(1)} Cr
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">National Utilization %</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-foreground">
                {summary.overallUtilizationPercentage}%
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Programme Budget Cards */}
      <div className="space-y-4">
        {budgets.map((b: any) => (
          <Card key={b.budgetId} className="shadow-subtle">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] font-mono">{b.status}</Badge>
                  <CardTitle className="text-base font-bold">Programme Budget: {b.programmeId}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Financial Year: {b.financialYear} &bull; Burn Rate: ₹{(b.burnRateINRPerMonth / 100000).toFixed(1)} Lakh/Month
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold font-mono text-emerald-600 block">
                  {b.utilizationPercentage}% Utilized
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Remaining: ₹{(b.remainingAmountINR / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Cost per Outcome Scorecard */}
              {b.costPerOutcome && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 text-center">
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Cost / Trainee</span>
                    <span className="font-mono font-bold text-foreground">₹{b.costPerOutcome.costPerTraineeINR?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Cost / Certified</span>
                    <span className="font-mono font-bold text-foreground">₹{b.costPerOutcome.costPerCertifiedCandidateINR?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Cost / Placed</span>
                    <span className="font-mono font-bold text-emerald-600">₹{b.costPerOutcome.costPerPlacedCandidateINR?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Cost / 365d Retained</span>
                    <span className="font-mono font-bold text-foreground">₹{b.costPerOutcome.costPerRetainedCandidate365dINR?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Budget Lines Breakdown */}
              <div className="space-y-2">
                <span className="font-bold text-foreground block">Budget Lines &amp; Variance Status:</span>
                <div className="space-y-1.5">
                  {b.budgetLines?.map((bl: any) => (
                    <div key={bl.lineId} className="p-2 rounded-lg border bg-card flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] font-mono">{bl.category}</Badge>
                          <Badge variant={bl.varianceStatus === "UNDERSPEND" ? "warning" : "secondary"} className="text-[9px]">
                            {bl.varianceStatus}
                          </Badge>
                        </div>
                        {bl.correctiveAction && (
                          <p className="text-[10px] text-amber-500">{bl.correctiveAction}</p>
                        )}
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-foreground">₹{(bl.actualSpentINR / 10000000).toFixed(2)} Cr</span>
                        <span className="text-[10px] text-muted-foreground block">Budget: ₹{(bl.budgetedINR / 10000000).toFixed(2)} Cr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
