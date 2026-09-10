"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers,
  HelpCircle,
  IndianRupee,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ExecutiveCommandCenterPage() {
  const [digest, setDigest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/command-center/digest")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setDigest(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              NATIONAL EXECUTIVE COMMAND CENTER
            </Badge>
            <Badge variant="success" className="text-[10px]">LIVE OPERATIONAL</Badge>
          </div>
          <h1 className="text-2xl font-bold font-heading pt-1">
            Labour-Market Decision &amp; Programme Execution Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pan-India executive synthesis answering the 9 critical strategic questions across active national missions
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/government/programmes">
            <Button size="sm" className="text-xs h-8 px-3 gap-1">
              <Layers className="w-3.5 h-3.5" /> All Programmes
            </Button>
          </Link>
          <Link href="/government/budgets">
            <Button size="sm" variant="outline" className="text-xs h-8 px-3 gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Budgets
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Level Macro Metrics */}
      {digest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Active National Missions</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-primary">{digest.totalActiveProgrammes}</span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Committed Funding</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-foreground">
                ₹{(digest.totalCommittedBudgetINR / 10000000).toFixed(1)} Cr
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">Formal Placement Rate</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-emerald-600">{digest.overallPlacementRatePercentage}%</span>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[11px]">365-Day Retention (EPFO)</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <span className="text-2xl font-bold font-mono text-foreground">{digest.overall365dRetentionRatePercentage}%</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* The 9 Executive Questions Matrix */}
      {digest && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold font-heading flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary" /> The 9 Core Executive Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">1. WHAT IS HAPPENING?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whatIsHappening}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">2. WHY IS IT HAPPENING?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whyIsItHappening}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">3. WHERE IS IT HAPPENING?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whereIsItHappening}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">4. WHO IS AFFECTED?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whoIsAffected}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">5. WHAT SHOULD WE DO?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whatShouldWeDo}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">6. WHAT IS BEING DONE?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whatIsAlreadyBeingDone}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-emerald-500/30">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="success" className="text-[9px] w-fit">7. IS IT WORKING?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.isItWorking}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-primary/20">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="outline" className="text-[9px] w-fit">8. HOW MUCH DOES IT COST?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.howMuchDoesItCost}
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-amber-500/30">
              <CardHeader className="p-3 pb-1.5">
                <Badge variant="warning" className="text-[9px] w-fit">9. WHAT IS AT RISK?</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed">
                {digest.whatIsAtRisk}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
