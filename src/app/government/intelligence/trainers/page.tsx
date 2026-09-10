"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { TrainerGapMetric } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function TrainerIntelligencePage() {
  const [gaps, setGaps] = useState<TrainerGapMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/trainers/gaps")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGaps(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Vocational Faculty &amp; Master Instructors</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Trainer Capacity &amp; Competency Gaps
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluating instructor certifications vs sanctioned course requirements across districts
          </p>
        </div>
      </div>

      {/* Trainer Gaps Table */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Competency Deficit Analysis
          </CardTitle>
          <CardDescription className="text-xs">
            Required vs available certified instructors for sanctioned technical trades
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading instructor competency registry...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Skill Competency</th>
                    <th className="px-4 py-3 font-semibold">District &amp; State</th>
                    <th className="px-4 py-3 font-semibold text-center">Severity</th>
                    <th className="px-4 py-3 font-semibold text-right">Required Faculty</th>
                    <th className="px-4 py-3 font-semibold text-right">Certified Available</th>
                    <th className="px-4 py-3 font-semibold text-right">Net Deficit</th>
                    <th className="px-4 py-3 font-semibold">Retraining &amp; FDP Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs font-mono">
                  {gaps.map((g) => (
                    <tr key={`${g.skillId}-${g.district}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-sans font-semibold text-foreground">
                        {g.skillName}
                      </td>
                      <td className="px-4 py-3 font-sans text-muted-foreground">
                        {g.district}, {g.state}
                      </td>
                      <td className="px-4 py-3 text-center font-sans">
                        <Badge variant={g.severity === "CRITICAL" ? "destructive" : g.severity === "HIGH" ? "default" : "secondary"}>
                          {g.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">{g.requiredTrainers}</td>
                      <td className="px-4 py-3 text-right font-semibold">{g.availableTrainers}</td>
                      <td className={`px-4 py-3 text-right font-bold ${g.netGap > 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {g.netGap > 0 ? `-${g.netGap}` : "0"}
                      </td>
                      <td className="px-4 py-3 font-sans text-[11px] text-muted-foreground max-w-sm">
                        {g.retrainingRecommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DataProvenancePanel
        sources={["DGT National Instructor Media Portal", "NSTI Master Trainer Registry", "State Vocational Directorates"]}
        timePeriod="2026-Q2 Faculty Audit"
        confidenceScore={0.95}
        isSyntheticPilotData={false}
        methodology="Direct matching of course required competencies against verified master trainer certification records."
      />
    </div>
  );
}
