"use client";

import React from "react";
import { useParams } from "next/navigation";
import { platformStore } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  BookOpen,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";

export default function CandidateSkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;

  const skill = platformStore.getSkillById(skillId) || platformStore.getSkills()[0];
  const candidate = platformStore.getCandidateProfile();
  const candidateSkill = candidate.skills.find((s) => s.skillId === skill.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 gap-1">
          <Link href="/candidate/skills">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Skill Passport
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
              {skill.code}
            </span>
            {skill.isEmerging && (
              <Badge variant="info" className="text-xs">
                Emerging Competency
              </Badge>
            )}
            {skill.isGreenSkill && (
              <Badge variant="success" className="text-xs">
                Green Skill
              </Badge>
            )}
          </div>

          {candidateSkill && (
            <StatusBadge status={candidateSkill.verificationStatus} />
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
          {skill.name}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {skill.description}
        </p>
      </div>

      {/* Candidate Verification Status Dossier */}
      {candidateSkill ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Your Verified Credential Status</span>
              </CardTitle>
              <Badge variant="success">Active on Skill Passport</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground block">Verified Proficiency</span>
                <span className="font-bold text-foreground text-sm">{candidateSkill.claimedProficiency}</span>
              </div>
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground block">Proctored Score</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {candidateSkill.assessedScore || 90}/100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground block">Attestation Source</span>
                <span className="font-bold text-foreground text-sm">Automotive SSC Grid</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Unverified Competency
              </p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Take a 15-minute proctored assessment to verify this skill and boost your readiness match.
              </p>
            </div>
            <Button asChild size="sm" className="text-xs font-semibold">
              <Link href="/candidate/assessments">Take Assessment &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Demand & Cluster Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Industrial Cluster Demand Signals</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Verified corporate hiring requisitions across key Indian economic zones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Chakan Automotive &amp; EV Hub (Pune)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +54.2% YoY
                </span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                3,840 active requisitions across 840 manufacturing units.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Sriperumbudur - Oragadam Corridor (Chennai)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +38.0% YoY
                </span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                2,100 active requisitions across battery and electronics assemblers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related ITI Courses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Aligned ITI &amp; Vocational Programs</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Government and accredited institutes teaching this standard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-semibold text-foreground">
                Advanced Certificate in EV Battery Management &amp; Diagnostics
              </h4>
              <p className="text-primary font-medium text-[11px]">
                Government ITI Aundh (Centre of Excellence, Pune)
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                <span>320 Hours &bull; 92.5% Health Score</span>
                <Link href="/courses" className="text-primary font-semibold hover:underline">
                  View Syllabus &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
