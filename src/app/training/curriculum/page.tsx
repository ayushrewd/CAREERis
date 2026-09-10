"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TrainingCurriculumPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState("course-bms-lead-01");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/training/curriculum?courseId=${selectedCourse}`).then((r) => r.json()),
      fetch(`/api/training/curriculum/gap-analysis?courseId=${selectedCourse}`).then((r) => r.json()),
    ])
      .then(([modRes, gapRes]) => {
        if (modRes.success) setModules(modRes.data || []);
        if (gapRes.success) setGapAnalysis(gapRes.data);
      })
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Curriculum Intelligence &amp; Module Versioning</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Module-to-Skill ontological mappings, curriculum gap evaluations &amp; employer feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 text-xs rounded-lg border bg-background"
          >
            <option value="course-bms-lead-01">High-Voltage BMS Specialist</option>
            <option value="course-5axis-cnc-01">5-Axis CNC Precision Machining</option>
            <option value="course-edge-ai-01">Industrial IoT &amp; Edge AI Diploma</option>
            <option value="course-legacy-welder-01">Manual Welder (Legacy Trade)</option>
          </select>
        </div>
      </div>

      {/* Curriculum Gap Evaluation Card */}
      {gapAnalysis && (
        <Card className="shadow-subtle border-primary/30 bg-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={gapAnalysis.freshnessStatus === "FRESH" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {gapAnalysis.freshnessStatus}
                </Badge>
                <CardTitle className="text-sm font-bold">{gapAnalysis.courseTitle}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Curriculum Gap Score: <span className="font-bold text-foreground font-mono">{gapAnalysis.gapScore}/100</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl border bg-muted/20 space-y-1.5">
                <span className="font-bold text-foreground block text-xs">Covered Canonical Skills</span>
                <div className="flex flex-wrap gap-1">
                  {gapAnalysis.coveredSkills?.map((s: any) => (
                    <Badge key={s.skillId} variant="success" className="text-[10px]">
                      ✓ {s.skillName}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-muted/20 space-y-1.5">
                <span className="font-bold text-foreground block text-xs">Missing Employer Demanded Skills</span>
                <div className="flex flex-wrap gap-1">
                  {gapAnalysis.missingEmployerDemandedSkills?.map((s: any) => (
                    <Badge key={s.skillId} variant="destructive" className="text-[10px]">
                      ⚠ {s.skillName} ({s.marketDemandVolume} Vacancies)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-heading">Active Curriculum Modules ({modules.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <Card key={m.moduleId} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono">{m.version}</Badge>
                  <Badge variant="success" className="text-[10px]">{m.status}</Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{m.moduleName}</CardTitle>
                <CardDescription className="text-xs">{m.durationHours} Hours &bull; Market Relevance: {m.marketRelevanceScore}%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <p className="text-[11px] text-muted-foreground">{m.description}</p>
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground block">Mapped Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {m.mappedSkillNames?.map((sk: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-[9px]">{sk}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
