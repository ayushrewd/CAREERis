"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Upload, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CandidateResumePage() {
  const [optimization, setOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/resume/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOptimization(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <FileText className="w-3.5 h-3.5 mr-1" /> RESUME INTELLIGENCE &amp; ATS OPTIMIZER
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Skill &amp; Keyword Alignment: {optimization?.targetJobTitle || "Target Job"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare parsed resume skills against employer job requisitions, identify weak evidence &amp; missing keywords
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-subtle p-4 border-primary/30 bg-primary/5 text-center">
          <span className="text-xs text-muted-foreground">Target Role ATS Match</span>
          <span className="text-2xl font-mono font-bold text-primary block pt-1">{optimization?.overallMatchPercentage || 88}%</span>
        </Card>
        <Card className="shadow-subtle p-4 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground">Target Employer</span>
          <span className="text-sm font-bold text-foreground block pt-2">{optimization?.companyName || "Tata Motors"}</span>
        </Card>
        <Card className="shadow-subtle p-4 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground">Candidate Profile</span>
          <span className="text-sm font-bold text-foreground block pt-2">Rohit Sharma (1.5 Yrs Exp)</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Skills */}
        <Card className="shadow-subtle border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Verified Skills ({optimization?.matchedSkills?.length || 0})
            </CardTitle>
            <CardDescription className="text-xs">Directly matching employer requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {optimization?.matchedSkills?.map((s: string) => (
                <Badge key={s} variant="success" className="text-xs">
                  ✓ {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card className="shadow-subtle border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-amber-500 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Missing Keywords &amp; Standards ({optimization?.missingKeywords?.length || 0})
            </CardTitle>
            <CardDescription className="text-xs">Recommended to add to your skills summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {optimization?.missingKeywords?.map((s: string) => (
                <Badge key={s} variant="warning" className="text-xs">
                  ! {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Recommendations */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Actionable Resume Optimization Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {optimization?.actionableRecommendations?.map((rec: string, i: number) => (
            <div key={i} className="p-2.5 rounded-lg border bg-muted/20 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-foreground">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
