"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, ShieldCheck, MapPin, Zap } from "lucide-react";

export default function GovernmentEmergingSkillsPage() {
  const emergingSkills = [
    {
      skill: "ROS 2 Autonomous Navigation & SLAM",
      growthSignal: "+72.0% YoY Demand Acceleration",
      sector: "Robotics & Logistics Automation",
      cluster: "Bengaluru & Pune Technology Hubs",
      adoptionHorizon: "Immediate (0 - 12 Months)",
      confidence: 91,
      isGreen: false,
    },
    {
      skill: "Battery Management Systems (BMS) Thermal Calibration",
      growthSignal: "+54.2% YoY Industrial Demand",
      sector: "Electric Mobility & Energy Storage",
      cluster: "Chakan Auto Corridor, Pune & Sriperumbudur",
      adoptionHorizon: "Immediate (0 - 12 Months)",
      confidence: 95,
      isGreen: true,
    },
    {
      skill: "Green Hydrogen Electrolyzer Maintenance",
      growthSignal: "+110.0% Emerging Requisitions",
      sector: "Renewable Energy & Clean Tech",
      cluster: "Gujarat Coastal & Maharashtra Industrial Zones",
      adoptionHorizon: "Mid-Term (12 - 24 Months)",
      confidence: 84,
      isGreen: true,
    },
    {
      skill: "Semiconductor Packaging & VLSI Test Engineering",
      growthSignal: "+68.5% Growth Trajectory",
      sector: "Semiconductor Assembly & Test (ATMP)",
      cluster: "Sanand, Gujarat & Noida",
      adoptionHorizon: "Near-Term (6 - 18 Months)",
      confidence: 88,
      isGreen: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Emerging Technology &amp; Future of Work Radar</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Emerging Skills &amp; Horizon Forecasting
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Early signals detected across industrial patent filings, foreign direct investments, and corporate hiring spikes.
          </p>
        </div>

        <Badge variant="purple" className="text-xs">
          Predictive Horizon 2026-2028
        </Badge>
      </div>

      {/* Emerging Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergingSkills.map((sk, idx) => (
          <Card key={idx} className="hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4 text-xs">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {sk.growthSignal}
                  </span>
                  {sk.isGreen && (
                    <Badge variant="success" className="text-[9px]">Green Skill</Badge>
                  )}
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">
                  {sk.skill}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{sk.sector}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adoption Horizon:</span>
                  <span className="font-semibold text-foreground">{sk.adoptionHorizon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Clusters:</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{sk.cluster}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Signal Confidence: <strong>{sk.confidence}%</strong></span>
                <span className="text-primary font-semibold">Track in District Plan &rarr;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
