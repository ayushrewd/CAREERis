"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Sparkles, TrendingUp, CheckCircle2, AlertCircle, Layers } from "lucide-react";
import Link from "next/link";

export default function CareerDiscoveryAndComparisonPage() {
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/careers/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setComparisonData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const roles = comparisonData?.roles || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Compass className="w-3.5 h-3.5 mr-1" /> CAREER DISCOVERY &amp; COMPARISON
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Explore &amp; Compare High-Opportunity Career Paths
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Empirical multi-role comparison: Match scores, skill gap bridges, time-to-employability &amp; regional hiring demand
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/candidate/careers/simulator">
            <Sparkles className="w-3.5 h-3.5" /> Open Career Simulator
          </Link>
        </Button>
      </div>

      {comparisonData?.summaryRecommendation && (
        <Card className="border-primary/30 bg-primary/5 shadow-subtle">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">AI Career Intelligence Insight:</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {comparisonData.summaryRecommendation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r: any) => (
          <Card key={r.roleId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">{r.industryName}</Badge>
                  <span className="font-mono text-xs font-bold text-primary">{r.overallMatchScore}% Match</span>
                </div>
                <CardTitle className="text-base font-bold pt-1">{r.roleTitle}</CardTitle>
                <CardDescription className="text-xs">
                  Salary: ₹{r.salaryRangeINR?.min?.toLocaleString()} - ₹{r.salaryRangeINR?.max?.toLocaleString()}/mo
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Demand:</span>
                    <span className="font-mono font-bold text-emerald-600">{r.marketDemandIndex}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Learning Time:</span>
                    <span className="font-mono font-bold text-foreground">{r.estimatedLearningMonths} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accredited Labs:</span>
                    <span className="font-mono font-bold text-foreground">{r.trainingInstitutesCount} ITIs</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground text-[11px] block">Matching Skills ({r.matchingSkillsCount}):</span>
                  <div className="flex flex-wrap gap-1">
                    {r.matchingSkills?.slice(0, 4).map((s: string) => (
                      <Badge key={s} variant="success" className="text-[9px]">
                        ✓ {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground text-[11px] block">Key Missing Skill:</span>
                  <div className="flex flex-wrap gap-1">
                    {r.missingSkills?.map((s: string) => (
                      <Badge key={s} variant="warning" className="text-[9px]">
                        ! {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1">
                <Link href={`/candidate/careers/simulator?targetRoleId=${r.roleId}`}>
                  Simulate Transition <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
