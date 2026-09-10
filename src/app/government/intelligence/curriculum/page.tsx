"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CurriculumHealthDetail } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function CurriculumIntelligencePage() {
  const [curricula, setCurricula] = useState<CurriculumHealthDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/curriculum/gaps")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCurricula(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-emerald-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Modular Trade Curriculum Alignment</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Curriculum Intelligence &amp; Market Alignment
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Module-level skill coverage, outdated technology detection, and emerging competency integration
          </p>
        </div>
      </div>

      {/* Curriculum Details Table */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Analyzed Modular Curricula ({curricula.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review curriculum alignment scores, freshness ratings, and missing market skills
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading curriculum registry...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Course Title</th>
                    <th className="px-4 py-3 font-semibold text-center">Freshness</th>
                    <th className="px-4 py-3 font-semibold text-right">Alignment Score</th>
                    <th className="px-4 py-3 font-semibold text-center">Last Revised</th>
                    <th className="px-4 py-3 font-semibold">Missing Market Skills</th>
                    <th className="px-4 py-3 font-semibold">Emerging Skills to Integrate</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {curricula.map((c) => (
                    <tr key={c.courseId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{c.courseTitle}</div>
                        <div className="text-[11px] text-muted-foreground">{c.modules.length} Core Modules</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={c.freshnessStatus === "FRESH" ? "default" : c.freshnessStatus === "CURRENT" ? "secondary" : "destructive"}>
                          {c.freshnessStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                        {c.curriculumGapScore}/100
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                        {c.lastRevisedDate}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-destructive">
                        {c.missingMarketSkills.length > 0 ? (
                          <span>{c.missingMarketSkills.map((m) => m.skillName).join(", ")}</span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-primary">
                        {c.emergingSkillsToIntegrate.length > 0 ? (
                          <span>{c.emergingSkillsToIntegrate.map((m) => m.skillName).join(", ")}</span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/government/courses/${c.courseId}/health`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <span>Syllabus</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
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
        sources={["CSTARI National Curriculum Database", "Sector Skill Council Qualification Packs (QP-NOS)"]}
        timePeriod="2026-Q2 Evaluation"
        confidenceScore={0.96}
        isSyntheticPilotData={false}
        methodology="Maps each curriculum syllabus module directly to Canonical Skill Graph competencies to flag gaps against live employer job requisitions."
      />
    </div>
  );
}
