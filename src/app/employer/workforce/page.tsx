"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Layers, ArrowLeft, ArrowRight, Scale, CheckCircle2, AlertTriangle, TrendingUp, GraduationCap } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function EmployerWorkforcePage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, decRes] = await Promise.all([
          fetch("/api/employer/workforce-plans?employerId=comp-tata-motors").then((r) => r.json()),
          fetch("/api/employer/decision/hire-vs-train", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roleId: "role-bms-lead",
              roleTitle: "Battery Management System (BMS) Calibration Specialist",
              skillId: "skill-bms",
              headcountNeeded: 32,
              urgencyLevel: "URGENT",
            }),
          }).then((r) => r.json()),
        ]);

        if (plansRes.success) setPlans(plansRes.data || []);
        if (decRes.success) setDecision(decRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Workforce Planning &amp; Decision Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Skill-based head-count demand forecasting and explainable Hire vs Train decision support
          </p>
        </div>
      </div>

      {/* Hire vs Train Decision Support Banner */}
      {decision && (
        <Card className="shadow-subtle border-primary/30 bg-gradient-to-r from-card via-card/95 to-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-xs gap-1">
                  <Scale className="w-3.5 h-3.5" /> Decision Recommendation: {decision.decisionRecommendation}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Confidence: {Math.round(decision.confidenceScore * 100)}%
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">Target Role: {decision.roleTitle}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <span className="font-bold text-xs text-foreground block">Strategic Action Plan</span>
              <p className="text-xs text-muted-foreground">{decision.recommendedActionPlan}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border bg-card space-y-2">
                <span className="font-bold text-foreground block">Direct Hiring Trade-offs</span>
                <ul className="space-y-1 text-muted-foreground text-[11px]">
                  {decision.comparativeAnalysis?.directHiringPros?.map((p: string, idx: number) => (
                    <li key={idx} className="text-emerald-600 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {p}
                    </li>
                  ))}
                  {decision.comparativeAnalysis?.directHiringRisks?.map((r: string, idx: number) => (
                    <li key={idx} className="text-amber-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border bg-card space-y-2">
                <span className="font-bold text-foreground block">Training / CoE Pipeline Trade-offs</span>
                <ul className="space-y-1 text-muted-foreground text-[11px]">
                  {decision.comparativeAnalysis?.trainingPipelinePros?.map((p: string, idx: number) => (
                    <li key={idx} className="text-emerald-600 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {p}
                    </li>
                  ))}
                  {decision.comparativeAnalysis?.trainingPipelineRisks?.map((r: string, idx: number) => (
                    <li key={idx} className="text-amber-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Local Institutional Partners */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold block">Available Institutional Partners in Industrial Corridor:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {decision.availableTrainingPartners?.map((tp: any) => (
                  <div key={tp.providerId} className="p-3 rounded-lg border bg-muted/20 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">{tp.providerName}</span>
                      <span className="text-[10px] text-muted-foreground">{tp.courseTitle} ({tp.durationWeeks} wks)</span>
                    </div>
                    <Badge variant="success" className="text-[9px]">
                      Health: {tp.healthScore}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workforce Plans List */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <CardTitle className="text-base font-bold">Active Workforce Plans</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Multi-quarter hiring and skill development roadmaps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-sm">{p.planTitle}</span>
                  <p className="text-xs text-muted-foreground">{p.planningPeriod} &bull; {p.targetIndustry}</p>
                </div>
                <Badge variant="primary" className="text-xs self-start sm:self-auto">{p.status}</Badge>
              </div>

              <div className="space-y-2 pt-2 border-t text-xs">
                <span className="font-semibold block text-[11px]">Role Headcount Targets:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {p.rolesTargeted?.map((r: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                      <span className="font-medium text-foreground block">{r.roleTitle}</span>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Net Need: <span className="font-bold text-foreground">{r.netHiringRequirement}</span></span>
                        <span>Priority: {r.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
