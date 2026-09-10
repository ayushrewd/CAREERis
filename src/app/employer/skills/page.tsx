"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function EmployerSkillsPage() {
  const skillsData = [
    {
      skillName: "Battery Management Systems (BMS)",
      category: "Electric Mobility",
      workforceCapability: "Intermediate",
      hiringDemandVolume: 95,
      marketSupplyStatus: "ACUTE_SHORTAGE",
      timeToHireDays: 48,
      isEmerging: true,
    },
    {
      skillName: "High-Voltage Safety Protocols",
      category: "Electrical Safety",
      workforceCapability: "Advanced",
      hiringDemandVolume: 60,
      marketSupplyStatus: "TIGHT",
      timeToHireDays: 32,
      isEmerging: false,
    },
    {
      skillName: "CAN Bus Diagnostics",
      category: "Automotive Electronics",
      workforceCapability: "Intermediate",
      hiringDemandVolume: 45,
      marketSupplyStatus: "BALANCED",
      timeToHireDays: 22,
      isEmerging: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Layers className="w-3.5 h-3.5 mr-1" /> EMPLOYER SKILL INTELLIGENCE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Workforce Capability vs Market Supply &amp; Hiring Scarcity
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Internal workforce skills compared against real-time regional hiring demand, talent tightness &amp; time-to-hire
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/employer/reskilling">
            <Sparkles className="w-3.5 h-3.5" /> Plan Reskilling Pathway
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {skillsData.map((s) => (
          <Card key={s.skillName} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.marketSupplyStatus === "ACUTE_SHORTAGE" ? "warning" : "outline"} className="text-[10px] font-mono">
                    {s.marketSupplyStatus}
                  </Badge>
                  {s.isEmerging && <Badge variant="success" className="text-[10px]">EMERGING</Badge>}
                  <CardTitle className="text-base font-bold">{s.skillName}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5">
                  Category: {s.category} &bull; Internal Workforce Level: <span className="font-bold text-foreground">{s.workforceCapability}</span>
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-primary block">
                  Hiring Demand: +{s.hiringDemandVolume}
                </span>
                <span className="text-[10px] text-muted-foreground">Avg Time-to-Hire: {s.timeToHireDays} Days</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
