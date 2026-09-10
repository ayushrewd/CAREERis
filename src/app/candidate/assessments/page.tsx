"use client";

import React, { useState, useEffect } from "react";
import { platformStore, AssessmentDefinition, AssessmentAttemptRecord } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssessmentRunner } from "@/components/candidate/AssessmentRunner";
import { FileCheck2, Clock, ShieldCheck, Play, Award, Search, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CandidateAssessmentsPage() {
  const [assessments, setAssessments] = useState(platformStore.getAssessments());
  const [attempts, setAttempts] = useState(platformStore.getAssessmentAttempts());
  const [activeAssessment, setActiveAssessment] = useState<AssessmentDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    return platformStore.subscribe(() => {
      setAssessments(platformStore.getAssessments());
      setAttempts(platformStore.getAssessmentAttempts());
    });
  }, []);

  const filteredAssessments = assessments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If user is actively taking an assessment, display the AssessmentRunner engine
  if (activeAssessment) {
    return (
      <div className="py-6">
        <AssessmentRunner
          assessment={activeAssessment}
          onComplete={(attempt) => {
            setAttempts(platformStore.getAssessmentAttempts());
          }}
          onExit={() => setActiveAssessment(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Standardized Diagnostic Testing</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Skill Assessments &amp; Proctored Verification
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Take timed competency assessments to earn verified badges on your Skill Passport and unlock direct employer requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs">
            Instant Skill Attestation
          </Badge>
        </div>
      </div>

      {/* Recent Attempts History */}
      {attempts.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
              <Award className="w-4 h-4" />
              <span>Recent Proctored Assessment Results ({attempts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="p-3 rounded-xl bg-background border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="font-semibold text-foreground">{att.assessmentTitle}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Completed {formatDate(att.completedAt)} &bull; Granted: <strong>{att.proficiencyGranted}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {att.score}% Score
                  </span>
                  <Badge variant={att.isPassed ? "success" : "destructive"}>
                    {att.isPassed ? "PASSED" : "RETAKE"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Filter */}
      <div className="p-4 rounded-xl border bg-card shadow-subtle max-w-md">
        <Input
          placeholder="Search by skill name (e.g. BMS, PLC, Automation)..."
          icon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssessments.map((asmt) => (
          <Card key={asmt.id} className="hover:border-primary/50 transition-all flex flex-col justify-between">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-primary">
                    {asmt.code}
                  </span>
                  <Badge variant="purple" className="text-[10px]">
                    {asmt.difficulty}
                  </Badge>
                </div>

                <h3 className="font-semibold text-base text-foreground leading-snug">
                  {asmt.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {asmt.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/30 border text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Duration</span>
                  <span className="font-bold text-foreground">{asmt.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Questions</span>
                  <span className="font-bold text-foreground">{asmt.totalQuestions} items</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Pass Score</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{asmt.passingScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-verifies Skill
                </span>
                <Button
                  size="sm"
                  onClick={() => setActiveAssessment(asmt)}
                  className="text-xs font-semibold gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
