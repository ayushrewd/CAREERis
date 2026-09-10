"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Building2, TrendingUp, AlertTriangle, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function GovernmentTrainingIntelligencePage() {
  const trainingMetrics = {
    totalInstitutesPanIndia: 14953,
    totalSanctionedCapacity: 2450000,
    activeEnrollmentCount: 1985000,
    averageCapacityUtilization: 81.0,
    highRiskCoursesCount: 142,
    criticalTrainerDeficitCount: 88,
  };

  const districtSummaries = [
    {
      district: "Pune",
      state: "Maharashtra",
      institutesCount: 24,
      sanctionedSeats: 12400,
      utilizationRate: 91.5,
      placementRate: 88.4,
      priorityIntervention: "Modernize High-Voltage EV & BMS Labs",
    },
    {
      district: "Chennai",
      state: "Tamil Nadu",
      institutesCount: 18,
      sanctionedSeats: 9800,
      utilizationRate: 88.0,
      placementRate: 86.2,
      priorityIntervention: "Expand 5-Axis CNC & Robotic Automation Seats",
    },
    {
      district: "Ahmedabad",
      state: "Gujarat",
      institutesCount: 16,
      sanctionedSeats: 8200,
      utilizationRate: 84.5,
      placementRate: 83.1,
      priorityIntervention: "Scale Solar PV & Green Hydrogen Trainer Certifications",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Building2 className="w-3.5 h-3.5 mr-1" /> NATIONAL TRAINING INTELLIGENCE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Pan-India ITI &amp; Vocational Capacity &amp; Quality Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time monitoring of 14,900+ ITIs, polytechnics, lab infrastructure health &amp; district training plans
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/government/interventions">
            <Sparkles className="w-3.5 h-3.5" /> Plan District Interventions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">Audited Institutes</span>
          <span className="text-xl font-mono font-bold text-foreground block pt-1">{trainingMetrics.totalInstitutesPanIndia.toLocaleString()}</span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">National Sanctioned Seats</span>
          <span className="text-xl font-mono font-bold text-foreground block pt-1">{(trainingMetrics.totalSanctionedCapacity / 100000).toFixed(2)} Lakhs</span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">Average Seat Utilization</span>
          <span className="text-xl font-mono font-bold text-emerald-600 block pt-1">{trainingMetrics.averageCapacityUtilization}%</span>
        </Card>
        <Card className="p-4 bg-muted/20 border text-center">
          <span className="text-xs text-muted-foreground">High-Risk Courses (Obsolescent)</span>
          <span className="text-xl font-mono font-bold text-amber-600 block pt-1">{trainingMetrics.highRiskCoursesCount} Flagged</span>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading">District Training Capacity &amp; Priority Interventions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {districtSummaries.map((d) => (
            <Card key={d.district} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">{d.district}, {d.state}</Badge>
                  <Badge variant="success" className="text-[10px]">Util: {d.utilizationRate}%</Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{d.institutesCount} Accredited ITIs</CardTitle>
                <CardDescription className="text-xs">
                  Sanctioned Capacity: {d.sanctionedSeats.toLocaleString()} Seats &bull; Placement: {d.placementRate}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 rounded bg-muted/30 border text-[11px]">
                  <strong>Recommended Intervention:</strong> {d.priorityIntervention}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
