"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Award, ShieldCheck, MapPin, ArrowLeft, CheckCircle2, AlertCircle, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function CandidateMatchDossierPage({ params }: { params: { id: string } }) {
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/employer/candidates/${params.id}/match?requisitionId=req-tm-bms-01`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setDossier(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading match dossier...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer/candidates">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Candidate Discovery
          </Button>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">{dossier?.candidateName}</h1>
            {dossier?.isVerifiedSkillPassportHolder && (
              <Badge variant="success" className="text-xs gap-1">
                <Award className="w-3.5 h-3.5" /> Verified Skill Passport Holder
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {dossier?.headline} &bull; <MapPin className="w-3.5 h-3.5 inline text-muted-foreground" /> {dossier?.currentDistrict}, {dossier?.currentState}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-4xl font-extrabold text-emerald-600 font-mono">
              {dossier?.overallMatchScore}%
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium">
              Explainable Match Score
            </span>
          </div>
          <Link href="/employer/interviews">
            <Button size="sm" className="gap-1.5 shadow-md">
              <Calendar className="w-3.5 h-3.5" /> Schedule Panel
            </Button>
          </Link>
        </div>
      </div>

      {/* 7-Factor Score Breakdown */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">7-Factor Explainable Match Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Transparent scoring grounded in National Occupational Standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dossier?.factors && Object.entries(dossier.factors).map(([key, factor]: [string, any]) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{factor.name} <span className="text-muted-foreground font-normal">({factor.weight}% weight)</span></span>
                <span className="font-mono font-bold text-foreground">{factor.score}/100</span>
              </div>
              <ProgressBar value={factor.score} className="h-2" />
              <p className="text-[10px] text-muted-foreground">{factor.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-subtle border-emerald-500/20 bg-gradient-to-b from-card to-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matching Strengths ({dossier?.matchingSkills?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {dossier?.matchingSkills?.map((s: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-lg border bg-card text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold block">{s.skillName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    Proficiency: <span className="font-medium text-foreground">{s.claimedProficiency}</span> (Req: {s.requiredProficiency})
                  </span>
                </div>
                {s.hasEvidence && (
                  <Badge variant="success" className="text-[9px]">Verified</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-amber-500/20 bg-gradient-to-b from-card to-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Skill Gaps & Development Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {dossier?.partialGaps?.length === 0 && dossier?.missingMandatorySkills?.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3">Zero critical skill gaps detected. Candidate is fully ready for deployment.</p>
            ) : (
              <>
                {dossier?.partialGaps?.map((g: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg border bg-card text-xs">
                    <span className="font-semibold block">{g.skillName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      Current: {g.currentProficiency} &bull; Target: {g.requiredProficiency}
                    </span>
                  </div>
                ))}
                {dossier?.missingMandatorySkills?.map((m: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-destructive/20 bg-destructive/5 text-xs">
                    <span className="font-semibold text-destructive block">{m}</span>
                    <span className="text-[10px] text-muted-foreground">Mandatory requirement missing.</span>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
