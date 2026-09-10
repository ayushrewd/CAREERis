"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DistrictPerformancePage() {
  const districts = [
    {
      id: "dist-pune",
      name: "Pune",
      state: "Maharashtra",
      demandIntensity: "HIGH",
      activeProgrammes: 2,
      placedCount: 3620,
      retention365dRate: 89.4,
      prioritySkillDeficit: "Battery Management Systems (BMS)",
      riskStatus: "LOW",
    },
    {
      id: "dist-chennai",
      name: "Chennai",
      state: "Tamil Nadu",
      demandIntensity: "HIGH",
      activeProgrammes: 1,
      placedCount: 2840,
      retention365dRate: 87.1,
      prioritySkillDeficit: "EV Traction Inverter Testing",
      riskStatus: "LOW",
    },
    {
      id: "dist-ahmedabad",
      name: "Ahmedabad",
      state: "Gujarat",
      demandIntensity: "MODERATE",
      activeProgrammes: 1,
      placedCount: 1950,
      retention365dRate: 84.5,
      prioritySkillDeficit: "Precision 5-Axis CNC Machining",
      riskStatus: "MEDIUM",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">District Performance &amp; Risk Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Granular district-level labour demand intensity, active programme deliverables, EPFO placement retention &amp; bottleneck risks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {districts.map((d) => (
          <Card key={d.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={d.riskStatus === "LOW" ? "success" : "warning"} className="text-[10px]">
                  {d.riskStatus} RISK
                </Badge>
                <span className="text-xs text-muted-foreground">{d.state}</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{d.name}</CardTitle>
              <CardDescription className="text-xs">
                Active Missions: <span className="font-bold text-foreground">{d.activeProgrammes}</span> &bull; Placed: {d.placedCount?.toLocaleString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">365-Day Retention:</span>
                  <span className="font-mono font-bold text-emerald-600">{d.retention365dRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority Deficit:</span>
                  <span className="font-bold text-foreground text-right text-[11px]">{d.prioritySkillDeficit}</span>
                </div>
              </div>

              <Link href={`/government/district-action?districtId=${d.id}`}>
                <Button size="sm" variant="outline" className="w-full text-xs h-7 gap-1">
                  District Action Center <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
