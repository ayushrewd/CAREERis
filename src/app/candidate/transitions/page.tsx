"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Layers, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CandidateTransitionsPage() {
  const [transitions, setTransitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/transitions")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTransitions(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Layers className="w-3.5 h-3.5 mr-1" /> CAREER TRANSITIONS &amp; TRANSFERABILITY
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Skill Overlap Analysis &amp; Lateral Transition Pathways
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate how your current technical competencies transfer into high-growth electric mobility &amp; automation roles
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transitions.map((t) => (
          <Card key={t.transitionId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] font-mono">
                    {t.skillTransferabilityPercentage}% Skill Transferability
                  </Badge>
                  <CardTitle className="text-base font-bold">
                    {t.fromRoleTitle} &rarr; {t.toRoleTitle}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs pt-1">
                  Demand Growth: <span className="font-bold text-emerald-600">+{t.marketDemandGrowthPercentage}% / Yr</span> &bull; Estimated Learning: {t.estimatedLearningWeeks} Weeks
                </CardDescription>
              </div>

              <Button asChild size="sm" className="gap-1.5 text-xs">
                <Link href="/candidate/learning">
                  <BookOpen className="w-3.5 h-3.5" /> Start Learning Pathway
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground mr-1">Shared Competencies:</span>
                {t.sharedSkills?.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-[9px]">✓ {s}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground mr-1">Gap Skills to Acquire:</span>
                {t.gapSkills?.map((g: any) => (
                  <Badge key={g.skillName} variant="warning" className="text-[9px]">! {g.skillName}</Badge>
                ))}
              </div>

              <div className="p-2 rounded bg-muted/30 border text-[11px] text-muted-foreground">
                <strong>Prerequisite Course:</strong> {t.prerequisiteCourses?.join(", ")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
