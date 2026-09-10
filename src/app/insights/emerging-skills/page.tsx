"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, ArrowRight, TrendingUp, Layers } from "lucide-react";
import Link from "next/link";

export default function EmergingSkillsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/emerging-skills")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const skills = data?.emergingSkills || [];
  const bundles = data?.skillBundles || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/insights">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Labour Market Insights
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Emerging Skill Predictions &amp; Adoption Curves</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Skill lifecycle stages (Early Signal &rarr; Acceleration &rarr; Mainstream) and future skill bundles
          </p>
        </div>
      </div>

      {/* Emerging Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((sk: any) => (
          <Card key={sk.skillId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="success" className="text-[10px]">
                  {sk.adoptionStage}
                </Badge>
                <span className="text-xs font-mono font-bold text-emerald-600">+{sk.growthRatePercentage}% YoY</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{sk.skillName}</CardTitle>
              <CardDescription className="text-xs">{sk.categoryName} &bull; Supply Lag: {sk.trainingSupplyLagMonths} Months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Adoption Velocity</span>
                  <span className="font-bold text-foreground">{sk.employerAdoptionVelocity}/100</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Cross-Industry Diffusion</span>
                  <span className="font-bold text-foreground">{sk.crossIndustryDiffusionIndex}/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground font-mono">Confidence: {(sk.forecastConfidence * 100).toFixed(0)}%</span>
                <Link href={`/skills/${sk.skillId}/forecast`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    Full Forecast <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Future Skill Bundles */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold font-heading">Co-Occurring Future Skill Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((b: any) => (
            <Card key={b.bundleId} className="shadow-subtle">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono">Bundle</Badge>
                  <span className="text-xs font-mono font-bold text-primary">+{b.projectedGrowthYoY}% YoY</span>
                </div>
                <CardTitle className="text-base font-bold pt-1">{b.bundleName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex flex-wrap gap-1">
                  {b.skills?.map((sk: any) => (
                    <Badge key={sk.skillId} variant="secondary" className="text-[9px]">{sk.skillName}</Badge>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Target Roles: {b.targetRoles?.join(", ")} &bull; Demanding Industries: {b.demandingIndustries?.join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
