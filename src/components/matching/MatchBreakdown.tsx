"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle2, AlertCircle, Sparkles, MapPin, Briefcase, FileCheck2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MatchBreakdownProps {
  overallMatchPercentage: number;
  skillMatchPercentage: number;
  expMatchPercentage: number;
  locationFitPercentage: number;
  evidenceStrengthPercentage: number;
  strongMatches: string[];
  partialMatches: string[];
  missingSkills: string[];
  locationDetails?: string;
  className?: string;
}

export function MatchBreakdown({
  overallMatchPercentage,
  skillMatchPercentage,
  expMatchPercentage,
  locationFitPercentage,
  evidenceStrengthPercentage,
  strongMatches,
  partialMatches,
  missingSkills,
  locationDetails,
  className,
}: MatchBreakdownProps) {
  return (
    <div className={cn("p-5 rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 space-y-5", className)}>
      {/* Header Match Score */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Candidate-Job Fit</span>
          </div>
          <h4 className="text-xl font-bold font-heading text-foreground mt-0.5">
            {overallMatchPercentage}% Overall Readiness Match
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparently computed from verified competencies, experience history, and cluster proximity.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <span
            className={cn(
              "text-2xl font-black font-heading px-3 py-1 rounded-xl shadow-inner",
              overallMatchPercentage >= 85
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : overallMatchPercentage >= 70
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            )}
          >
            {overallMatchPercentage}%
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">
            {overallMatchPercentage >= 85 ? "High Placement Fit" : "Moderate Gap"}
          </span>
        </div>
      </div>

      {/* Dimensional Breakdown Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-background/60 border text-xs">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Skill Match</span>
            <span className="font-bold text-foreground">{skillMatchPercentage}%</span>
          </div>
          <ProgressBar value={skillMatchPercentage} size="sm" showValue={false} variant="primary" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-bold text-foreground">{expMatchPercentage}%</span>
          </div>
          <ProgressBar value={expMatchPercentage} size="sm" showValue={false} variant="success" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Location Fit</span>
            <span className="font-bold text-foreground">{locationFitPercentage}%</span>
          </div>
          <ProgressBar value={locationFitPercentage} size="sm" showValue={false} variant="info" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Evidence Strength</span>
            <span className="font-bold text-foreground">{evidenceStrengthPercentage}%</span>
          </div>
          <ProgressBar value={evidenceStrengthPercentage} size="sm" showValue={false} variant="warning" />
        </div>
      </div>

      {/* Detailed Skill Breakdown Categories */}
      <div className="space-y-3 pt-1">
        {/* Strong Matches */}
        {strongMatches.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Strong &amp; Assessment-Verified Matches ({strongMatches.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {strongMatches.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Partial Matches */}
        {partialMatches.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Partial / Self-Attested Matches ({partialMatches.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {partialMatches.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills / Gaps */}
        {missingSkills.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Identified Skill Gaps ({missingSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium border border-rose-500/20 flex items-center gap-1"
                >
                  &times; {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {locationDetails && (
        <div className="pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            Cluster Location: {locationDetails}
          </span>
          <span>Verified against National Skill Taxonomy</span>
        </div>
      )}
    </div>
  );
}
