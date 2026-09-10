"use client";

import React, { useState, useEffect } from "react";
import { platformStore } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ShieldCheck, Sparkles, Plus, FileCheck2, ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function SkillPassportPage() {
  const [candidate, setCandidate] = useState(platformStore.getCandidateProfile());

  useEffect(() => {
    return platformStore.subscribe(() => {
      setCandidate(platformStore.getCandidateProfile());
    });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Credential Passport</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Verifiable Skill Passport
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically attestation-ready competency credentials verified via proctored assessments and ITI lab audits.
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
          <Link href="/candidate/assessments">
            <Plus className="w-3.5 h-3.5" />
            Verify New Skill
          </Link>
        </Button>
      </div>

      {/* Passport Summary Banner */}
      <div className="p-5 rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Holder: Rohit Sharma
            </span>
            <Badge variant="success" className="text-[10px]">
              National Grid Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            3 Standardized Competencies &bull; 2 Proctored Verified &bull; 1 Under Lab Review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            PASSPORT ID: #IN-MH-SK-9482
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidate.skills.map((skill) => (
          <Card key={skill.skillId} className="hover:border-primary/50 transition-all flex flex-col justify-between">
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-base text-foreground leading-snug">
                      {skill.skillName}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                      Standard Code: {skill.skillId.toUpperCase()}
                    </span>
                  </div>
                  <StatusBadge status={skill.verificationStatus} />
                </div>

                {/* Proficiency Badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Proficiency Level:</span>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {skill.claimedProficiency}
                  </span>
                </div>
              </div>

              {/* Assessment Score */}
              {skill.assessedScore && (
                <div className="p-3 rounded-xl bg-muted/30 border space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-emerald-500" />
                      Proctored Diagnostic Score
                    </span>
                    <span className="font-bold text-foreground">{skill.assessedScore}/100</span>
                  </div>
                  <ProgressBar
                    value={skill.assessedScore}
                    variant={skill.assessedScore >= 85 ? "success" : "primary"}
                    size="sm"
                    showValue={false}
                  />
                  {skill.verifiedAt && (
                    <span className="text-[10px] text-muted-foreground block pt-0.5">
                      Last Verified: {formatDate(skill.verifiedAt)}
                    </span>
                  )}
                </div>
              )}

              {/* Evidence Attachments */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Attached Verified Evidences ({skill.evidenceCount || 1})
                </span>
                <div className="p-2.5 rounded-lg border bg-background text-[11px] flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">Diagnostic_Log_Report.pdf</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Verified
                  </span>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-2 border-t flex items-center justify-between">
                <Link
                  href={`/candidate/skills/${skill.skillId}`}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Deep Skill Dossier &amp; Demand Radar &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
