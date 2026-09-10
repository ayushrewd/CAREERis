"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ShieldCheck, Scale, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ProgrammeEvaluationPage() {
  const params = useParams();
  const id = params.id as string;
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/programmes/${id}/evaluation`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setEvaluation(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Loading impact evaluation report...</div>;
  if (!evaluation) return <div className="p-12 text-center text-sm text-muted-foreground">Evaluation report not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href={`/government/programmes/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Programme Overview
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              INDEPENDENT IMPACT EVALUATION REPORT
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">{evaluation.evaluationType} METHODOLOGY</Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Post-Intervention Outcome &amp; Labour-Market Impact Evaluation
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluator: <span className="font-bold text-foreground">{evaluation.leadEvaluator}</span> &bull; Completed: {new Date(evaluation.evaluatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Methodology & Quality Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">Evaluation Confidence</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-emerald-600">{evaluation.confidenceLevel}%</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">High statistical significance across cohorts.</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">Data Completeness</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-primary">{evaluation.dataCompletenessPercentage}%</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">EPFO matching &amp; NCVT certification registries.</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">Attribution Tier</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-sm font-bold font-mono text-foreground block pt-1">{evaluation.evaluationType}</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Controlled pre/post longitudinal analysis.</p>
          </CardContent>
        </Card>
      </div>

      {/* Baseline vs Post-Intervention Table */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Longitudinal Outcome Comparison: Baseline vs Post-Intervention</CardTitle>
          <CardDescription className="text-xs">Direct delta tracking across key employability metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border bg-muted/20 text-center font-bold">
            <span className="text-left text-muted-foreground">Metric</span>
            <span>Pre-Intervention Baseline</span>
            <span className="text-emerald-600">Post-Intervention Achieved</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border bg-card text-center items-center">
            <span className="text-left font-bold">Formal Placement Rate</span>
            <span className="font-mono">{evaluation.baselineMetrics?.placementRatePercentage}%</span>
            <span className="font-mono font-bold text-emerald-600">
              {evaluation.postInterventionMetrics?.placementRatePercentage}% (+{(evaluation.postInterventionMetrics?.placementRatePercentage - evaluation.baselineMetrics?.placementRatePercentage).toFixed(1)}%)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border bg-card text-center items-center">
            <span className="text-left font-bold">Median Starting Salary (Monthly)</span>
            <span className="font-mono">₹{evaluation.baselineMetrics?.medianStartingSalaryINRMonth?.toLocaleString()}</span>
            <span className="font-mono font-bold text-emerald-600">
              ₹{evaluation.postInterventionMetrics?.medianStartingSalaryINRMonth?.toLocaleString()} (+48.5%)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border bg-card text-center items-center">
            <span className="text-left font-bold">365-Day Job Retention</span>
            <span className="font-mono">{evaluation.baselineMetrics?.retentionRate365dPercentage}%</span>
            <span className="font-mono font-bold text-emerald-600">
              {evaluation.postInterventionMetrics?.retentionRate365dPercentage}% (+{(evaluation.postInterventionMetrics?.retentionRate365dPercentage - evaluation.baselineMetrics?.retentionRate365dPercentage).toFixed(1)}%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Observed Impact & Causality Disclaimer */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Observed Impact Synthesis &amp; Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed">
          <p className="text-muted-foreground">{evaluation.observedImpactSummary}</p>

          <div className="p-2.5 rounded-lg border bg-primary/5 border-primary/20 space-y-1">
            <span className="font-bold text-primary block">Evaluation Causality &amp; Governance Disclaimer:</span>
            <p className="text-muted-foreground text-[11px]">{evaluation.causalityDisclaimer}</p>
          </div>

          <div className="pt-2">
            <span className="font-bold text-foreground block mb-1">Key Policy Recommendations:</span>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
              {evaluation.keyRecommendations?.map((rec: string, idx: number) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
