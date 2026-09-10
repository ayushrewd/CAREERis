"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft, ArrowRight, ShieldCheck, TrendingUp, Award, Layers } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentBudgetPage() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [outcomeAnalysis, setOutcomeAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/government/budget").then((r) => r.json()),
      fetch("/api/government/budget/outcome-analysis").then((r) => r.json()),
    ])
      .then(([allocRes, outcomeRes]) => {
        if (allocRes.success) setAllocations(allocRes.data || []);
        if (outcomeRes.success) setOutcomeAnalysis(outcomeRes.data);
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
          <h1 className="text-xl font-bold font-heading">Budget Intelligence &amp; Outcome ROI Governance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audited financial expenditure linked to candidate certification and verified placement costs
          </p>
        </div>
      </div>

      {/* Outcome Efficiency Metrics */}
      {outcomeAnalysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-subtle">
            <CardContent className="p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Total Public Investment</span>
              <span className="text-2xl font-bold font-mono text-foreground block">
                {formatCurrencyINR(outcomeAnalysis.totalBudgetSpentINR)}
              </span>
              <span className="text-[10px] text-muted-foreground">Audited Trailing 12 Months</span>
            </CardContent>
          </Card>
          <Card className="shadow-subtle">
            <CardContent className="p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Cost / Trainee</span>
              <span className="text-2xl font-bold font-mono text-primary block">
                {formatCurrencyINR(outcomeAnalysis.costPerTraineeINR)}
              </span>
              <span className="text-[10px] text-muted-foreground">{outcomeAnalysis.totalTraineesEnrolled?.toLocaleString("en-IN")} Enrolled</span>
            </CardContent>
          </Card>
          <Card className="shadow-subtle">
            <CardContent className="p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Cost / Verified Candidate</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 block">
                {formatCurrencyINR(outcomeAnalysis.costPerVerifiedCandidateINR)}
              </span>
              <span className="text-[10px] text-muted-foreground">{outcomeAnalysis.totalVerifiedSkillHolders?.toLocaleString("en-IN")} Verified</span>
            </CardContent>
          </Card>
          <Card className="shadow-subtle">
            <CardContent className="p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Cost / Placed Graduate</span>
              <span className="text-2xl font-bold font-mono text-indigo-600 block">
                {formatCurrencyINR(outcomeAnalysis.costPerPlacementINR)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">{outcomeAnalysis.placementOutcomeRatePercentage}% Placement Rate</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scheme Allocations Table */}
      <Card className="shadow-subtle overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Scheme-Wise Budget Utilization</CardTitle>
          <CardDescription className="text-xs">Allocated vs Committed vs Released vs Spent by Fiscal Year</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Scheme &amp; Fiscal Year</th>
                <th className="p-3">Scope / State</th>
                <th className="p-3">Allocated</th>
                <th className="p-3">Spent</th>
                <th className="p-3">Remaining</th>
                <th className="p-3">Utilization</th>
                <th className="p-3 text-right">Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allocations.map((a) => (
                <tr key={a.id} className="hover:bg-muted/10">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{a.schemeCode}</span>
                    <span className="text-[10px] text-muted-foreground">{a.fiscalYear}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {a.geographyScope} {a.stateCode ? `(${a.stateCode})` : ""}
                  </td>
                  <td className="p-3 font-mono font-medium">{formatCurrencyINR(a.allocatedINR)}</td>
                  <td className="p-3 font-mono font-bold text-emerald-600">{formatCurrencyINR(a.spentINR)}</td>
                  <td className="p-3 font-mono text-muted-foreground">{formatCurrencyINR(a.remainingINR)}</td>
                  <td className="p-3">
                    <Badge variant={a.utilizationPercentage > 70 ? "success" : "default"} className="text-[10px]">
                      {a.utilizationPercentage}%
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {a.linkedInterventionsCount} Actions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
