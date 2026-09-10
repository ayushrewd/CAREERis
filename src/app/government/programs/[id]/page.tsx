"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ShieldCheck, DollarSign, Award } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function ProgramDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/government/programs/${id}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setProgram(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading program details...</div>;
  if (!program) return <div className="p-8 text-center text-sm text-muted-foreground">Program not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government/programs">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> All Programs
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{program.name}</h1>
            <Badge variant="outline" className="text-xs font-mono">{program.schemeCode}</Badge>
            <Badge variant="success" className="text-xs">{program.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Department: {program.department} &bull; Lead Agency: {program.leadAgency}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Budget Allocated</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {formatCurrencyINR(program.budgetAllocatedINR)}
            </span>
            <span className="text-[10px] text-muted-foreground">Spent: {formatCurrencyINR(program.budgetSpentINR)}</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Enrolled Beneficiaries</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {program.enrolledBeneficiariesCount?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground">{program.completedTrainingCount?.toLocaleString("en-IN")} Completed</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Verified Skill Holders</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {program.verifiedSkillHoldersCount?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground">Skill Passport Certified</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Placed in Industry</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 block">
              {program.placedCount?.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {Math.round((program.placedCount / (program.completedTrainingCount || 1)) * 100)}% Placement Rate
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Key Performance Indicators &amp; Deliverables</CardTitle>
          <CardDescription className="text-xs">Monitored under national program evaluation framework</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {program.kpis?.map((kpi: any) => (
            <div key={kpi.kpiId} className="p-3 rounded-xl border bg-card flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground text-xs">{kpi.name}</span>
                <p className="text-[11px] text-muted-foreground">Target: {kpi.targetValue} {kpi.unit}</p>
              </div>
              <Badge variant={kpi.status === "ACHIEVED" ? "success" : "default"} className="text-xs">
                Current: {kpi.currentValue} {kpi.unit} ({kpi.status})
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
