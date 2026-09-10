"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2, Clock, Award, FolderGit2, BookOpen, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CareerSimulatorPage() {
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/careers/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSimulation(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const steps = simulation?.steps || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> CAREER PATH SIMULATOR
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Transition Blueprint: {simulation?.currentRoleTitle || "Current"} &rarr; {simulation?.targetRoleTitle || "Target"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step roadmap: Foundation &rarr; Core Skill &rarr; Project &rarr; Assessment &rarr; Verifiable Credential &rarr; Job Application
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-muted/20 border shadow-subtle text-center">
          <span className="text-xs text-muted-foreground">Current Readiness</span>
          <span className="text-xl font-mono font-bold text-foreground block pt-1">{simulation?.currentReadinessScore || 78}%</span>
        </Card>
        <Card className="p-4 bg-primary/5 border-primary/30 shadow-subtle text-center">
          <span className="text-xs text-muted-foreground">Projected Readiness</span>
          <span className="text-xl font-mono font-bold text-primary block pt-1">{simulation?.projectedReadinessScore || 96}%</span>
        </Card>
        <Card className="p-4 bg-muted/20 border shadow-subtle text-center">
          <span className="text-xs text-muted-foreground">Est. Total Duration</span>
          <span className="text-xl font-mono font-bold text-foreground block pt-1">{simulation?.totalEstimatedMonths || 2.0} Months</span>
        </Card>
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30 shadow-subtle text-center">
          <span className="text-xs text-muted-foreground">Simulation Confidence</span>
          <span className="text-xl font-mono font-bold text-emerald-600 block pt-1">{simulation?.confidenceScore || 94}%</span>
        </Card>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading">Sequential Execution Phases</h2>
        {steps.map((s: any) => (
          <Card key={s.phaseNumber} className={`shadow-subtle transition-all ${s.isAlreadyMet ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-primary/40"}`}>
            <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.isAlreadyMet ? "success" : "outline"} className="text-[10px] font-mono">
                    Phase {s.phaseNumber}: {s.stepType}
                  </Badge>
                  {s.isAlreadyMet && (
                    <Badge variant="success" className="text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> ALREADY MET
                    </Badge>
                  )}
                  <CardTitle className="text-sm font-bold">{s.title}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5">{s.description}</CardDescription>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {s.estimatedWeeks} wks
                </span>
                <Button asChild size="sm" variant={s.isAlreadyMet ? "ghost" : "default"} className="text-xs h-7 px-3">
                  <Link href={s.actionUrl}>
                    {s.isAlreadyMet ? "View Evidence" : "Execute Step"}
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="p-3 rounded-lg border bg-muted/20 text-[11px] text-muted-foreground">
        <strong>Governance Disclaimer:</strong> {simulation?.disclaimer}
      </div>
    </div>
  );
}
