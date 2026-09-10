"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function GovernmentReportsPage() {
  const [reportType, setReportType] = useState("DISTRICT_SKILL_GAP");
  const [stateCode, setStateCode] = useState("MH");
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/government/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType, stateCode }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedReport(data.data);
      }
    } finally {
      setGenerating(false);
    }
  };

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
          <h1 className="text-xl font-bold font-heading">Government Report Builder &amp; Audited Exports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate formal policy briefs, district skill gap matrices, and audited CSV/JSON packages
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Configure Report Scope</CardTitle>
          <CardDescription className="text-xs">Select data scope and report format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Report Template</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 rounded-lg border bg-background text-xs"
              >
                <option value="DISTRICT_SKILL_GAP">District Skill Gap Matrix &amp; Priorities</option>
                <option value="STATE_INTELLIGENCE">State Aggregate Intelligence Dossier</option>
                <option value="PROGRAM_PERFORMANCE">Program KPI &amp; Placement Performance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Target Geography</label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full p-2 rounded-lg border bg-background text-xs"
              >
                <option value="MH">Maharashtra (MH)</option>
                <option value="KA">Karnataka (KA)</option>
                <option value="TN">Tamil Nadu (TN)</option>
                <option value="GJ">Gujarat (GJ)</option>
                <option value="UP">Uttar Pradesh (UP)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerate} disabled={generating} className="w-full text-xs h-9 gap-1.5 shadow-md">
                <FileText className="w-3.5 h-3.5" />
                {generating ? "Generating..." : "Generate Policy Report"}
              </Button>
            </div>
          </div>

          {generatedReport && (
            <div className="p-4 rounded-xl border bg-card space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Generated
                  </Badge>
                  <span className="font-bold text-xs font-mono">{generatedReport.reportId}</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export Audited JSON
                </Button>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20 space-y-1 text-[11px]">
                <p><span className="font-semibold">Author:</span> {generatedReport.generatedBy} ({generatedReport.userRole})</p>
                <p><span className="font-semibold">Scope:</span> {generatedReport.scope}</p>
                <p><span className="font-semibold">Generated At:</span> {generatedReport.generatedAt}</p>
                <p><span className="font-semibold">Confidence:</span> {Math.round(generatedReport.confidenceScore * 100)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
