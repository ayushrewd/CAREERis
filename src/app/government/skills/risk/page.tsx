"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, TrendingUp, ShieldAlert, Layers } from "lucide-react";

export default function SkillRiskRegisterPage() {
  const riskSkills = [
    {
      skillName: "Battery Management Systems (BMS)",
      category: "Electric Mobility",
      classification: "CRITICAL_SHORTAGE",
      nationalDeficit: 104000,
      hiringDifficulty: "VERY_HIGH",
      trainingLagMonths: 18,
      recommendedAction: "Mandate ASDC EV Curriculum across all Tier-1 ITIs",
    },
    {
      skillName: "High-Voltage Safety Protocols",
      category: "Electrical Safety",
      classification: "CRITICAL_SHORTAGE",
      nationalDeficit: 83000,
      hiringDifficulty: "HIGH",
      trainingLagMonths: 12,
      recommendedAction: "Deploy CAT-III 1000V multimeter simulation rigs to 500 ITIs",
    },
    {
      skillName: "Manual ICE Carburetor Tuning",
      category: "Legacy Automotive",
      classification: "DECLINING_OBSOLETE",
      nationalDeficit: 0,
      hiringDifficulty: "LOW",
      trainingLagMonths: 0,
      recommendedAction: "Retire standalone course; integrate 5-hour historical module into Mechatronics",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> SKILL RISK REGISTER
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Critical Skill Shortages, Emerging Technologies &amp; Obsolescence Risk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time classification based on hiring scarcity, industrial training lag &amp; multi-year technological displacement
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {riskSkills.map((s) => (
          <Card key={s.skillName} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.classification === "CRITICAL_SHORTAGE" ? "warning" : "outline"} className="text-[10px] font-mono">
                    {s.classification}
                  </Badge>
                  <CardTitle className="text-base font-bold">{s.skillName}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5">
                  Category: {s.category} &bull; Hiring Difficulty: <span className="font-bold text-foreground">{s.hiringDifficulty}</span>
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-primary block">
                  {s.nationalDeficit > 0 ? `-${s.nationalDeficit.toLocaleString()} Deficit` : "Oversupplied / Inactive"}
                </span>
                <span className="text-[10px] text-muted-foreground">Training Lag: {s.trainingLagMonths} Months</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="p-2 rounded bg-muted/30 border text-[11px]">
                <strong>Recommended Policy Action:</strong> {s.recommendedAction}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
