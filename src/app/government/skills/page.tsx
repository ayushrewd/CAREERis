"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ArrowLeft, Search, Filter, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function GovernmentSkillPrioritiesPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("ALL");

  useEffect(() => {
    const url = selectedState === "ALL" ? "/api/government/skills/priorities" : `/api/government/skills/priorities?stateCode=${selectedState}`;
    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSkills(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [selectedState]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">National &amp; State Skill Priority Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ranked by demand intensity, demand/supply elasticity, and strategic industrial importance
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "MH", "KA", "TN", "GJ"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={selectedState === st ? "default" : "outline"}
              className="text-xs h-8 font-mono"
              onClick={() => setSelectedState(st)}
            >
              {st === "ALL" ? "National" : st}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((sk) => (
          <Card key={sk.skillId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-mono">Rank #{sk.nationalDemandRank}</Badge>
                <Badge
                  variant={sk.category === "CRITICAL_SHORTAGE" ? "destructive" : sk.category === "GREEN" ? "success" : "default"}
                  className="text-[10px]"
                >
                  {sk.category}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{sk.skillName}</CardTitle>
              <CardDescription className="text-xs">
                Demand/Supply Gap: <span className="font-bold text-rose-600 font-mono">{sk.demandSupplyRatio}x</span> &bull; Growth: <span className="text-emerald-600 font-bold">+{sk.growthRateYoYPercentage}% YoY</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px]">National Demand:</span>
                  <span className="font-bold text-foreground font-mono">{sk.annualNationalDemand?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px]">Verified Supply:</span>
                  <span className="font-bold text-emerald-600 font-mono">{sk.annualVerifiedSupply?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block">Leading States:</span>
                <div className="flex flex-wrap gap-1">
                  {sk.leadingStates?.map((st: string) => (
                    <Badge key={st} variant="secondary" className="text-[9px]">{st}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-primary/5 border-primary/20 space-y-0.5">
                <span className="text-[10px] font-bold text-primary block">Recommended Policy Action:</span>
                <p className="text-[11px] text-muted-foreground">{sk.recommendedPolicyAction}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
