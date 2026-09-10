"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Layers, Sparkles, ArrowRight, IndianRupee, Briefcase, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CandidateDiscoverPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/candidate/discover").then((r) => r.json());
        if (res.success) setRecommendations(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = activeFilter === "ALL"
    ? recommendations
    : recommendations.filter((r) => r.fitClassification === activeFilter);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs border-primary/30">
              <Layers className="w-3 h-3 mr-1" />
              Career Exploration
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Explainable Career Discovery
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Explore occupations classified by transferable skill overlap, regional hiring acceleration, and career pivot viability.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All Recommendations", value: "ALL" },
          { label: "Best Fit (75%+)", value: "BEST_FIT" },
          { label: "Strong Fit (50%+)", value: "STRONG_FIT" },
          { label: "Emerging Opportunities", value: "EMERGING_OPPORTUNITY" },
          { label: "Career Transitions", value: "CAREER_TRANSITION" },
          { label: "Adjacent Careers", value: "ADJACENT_CAREER" },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={activeFilter === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tab.value)}
            className="text-xs font-medium"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Discovery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <Card key={rec.roleId} className="bg-card/80 hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono bg-background">
                      {rec.fitClassification?.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {rec.fitScore}% Fit Score
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold font-heading text-foreground mt-2">
                    {rec.roleTitle}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {rec.industryName}
                  </CardDescription>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-foreground">
                    ₹{(rec.salaryRangeINR?.min / 100000).toFixed(1)}L - ₹{(rec.salaryRangeINR?.max / 100000).toFixed(1)}L
                  </div>
                  <span className="text-[10px] text-muted-foreground">{rec.annualDemandVolume} Openings</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="p-3 rounded-lg bg-muted/40 text-[11px] leading-relaxed text-muted-foreground">
                {rec.rationale}
              </p>

              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-foreground">
                  Matching Skills ({rec.matchingSkillsCount} of {rec.totalRequiredSkillsCount}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {rec.topMatchingSkills?.map((s: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      ✓ {s}
                    </Badge>
                  ))}
                  {rec.missingKeySkills?.slice(0, 2).map((s: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[10px] text-muted-foreground border-dashed">
                      + Learn {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <Button asChild variant="outline" size="sm" className="text-xs gap-1">
                  <Link href={`/candidate/transitions?toRoleId=${rec.roleId}`}>
                    Analyze Transition Bridge
                  </Link>
                </Button>
                <Button asChild size="sm" className="text-xs gap-1">
                  <Link href={`/candidate/readiness?targetRoleId=${rec.roleId}`}>
                    Evaluate Readiness
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataProvenancePanel
        sources={["CareerIS Unified Skill Graph", "Enterprise Requisition Engine", "State Vocational Placement Census"]}
        timePeriod="2026-Q2"
        confidenceScore={94}
        methodology="Semantic Skill Overlap & Transferability Indexing across 450+ Normalized Role Descriptors"
        isSyntheticPilotData={false}
      />
    </div>
  );
}
