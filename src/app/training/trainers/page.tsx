"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, ArrowRight, ShieldCheck, Award, Zap } from "lucide-react";
import Link from "next/link";

export default function TrainingTrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/trainers")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTrainers(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-xl font-bold font-heading">Trainer Capacity, Workload &amp; Retraining Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Faculty competency mapping, workload balance, and subsidized upskilling pathways
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((tr) => (
          <Card key={tr.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={tr.qualificationStatus === "QUALIFIED" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {tr.qualificationStatus}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {tr.workloadStatus}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{tr.trainerName}</CardTitle>
              <CardDescription className="text-xs">{tr.instituteName} &bull; {tr.yearsOfExperience} Yrs Exp</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Verified Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {tr.competencies?.map((c: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[9px]">
                      {c.skillName} ({c.proficiencyLevel})
                    </Badge>
                  ))}
                </div>
              </div>

              {tr.needsRetraining && tr.retrainingPathway && (
                <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">Recommended Retraining Pathway:</span>
                  <p className="text-[11px] text-muted-foreground">{tr.retrainingPathway.recommendedProgram}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="text-muted-foreground">{tr.weeklyTeachingHours} Teaching Hrs/Wk</span>
                <span className="font-semibold text-foreground">{tr.totalStudentsAssigned} Students</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
