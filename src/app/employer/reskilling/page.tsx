"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function EmployerReskillingPage() {
  const [pathways, setPathways] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/employer/reskilling").then((r) => r.json()),
      fetch("/api/v1/employer/training-partners").then((r) => r.json()),
    ])
      .then(([pRes, ptRes]) => {
        if (pRes.success) setPathways(pRes.data || []);
        if (ptRes.success) setPartners(ptRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <BookOpen className="w-3.5 h-3.5 mr-1" /> WORKFORCE RESKILLING &amp; PARTNERSHIPS
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Internal Reskilling Pathways &amp; Training Partner Discovery
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transition legacy workforce into high-tech EV &amp; automation roles with local accredited ITIs and COEs
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading">Active Reskilling Pathways</h2>
        {pathways.map((pw) => (
          <Card key={pw.pathwayId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {pw.eligibleEmployeeCount} Eligible Employees
                  </Badge>
                  <CardTitle className="text-base font-bold">
                    {pw.sourceRoleTitle} &rarr; {pw.targetRoleTitle}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs pt-1">
                  Partner: <span className="font-bold text-foreground">{pw.trainingProviderName}</span> &bull; Duration: {pw.trainingDurationWeeks} Weeks
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-primary block">
                  ₹{(pw.estimatedCostPerEmployeeINR / 1000).toFixed(0)}k / Employee
                </span>
                <span className="text-[10px] text-muted-foreground">Ramp: {pw.expectedProductivityRampWeeks} wks</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground text-[11px] mr-1">Gap Skills Addressed:</span>
                {pw.gapSkills?.map((s: string) => (
                  <Badge key={s} variant="warning" className="text-[9px]">! {s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold font-heading">Accredited Regional Training Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((p) => (
            <Card key={p.providerId} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">{p.providerType} &bull; {p.district}, {p.state}</Badge>
                  <Badge variant="success" className="text-[10px]">NCVT Accredited</Badge>
                </div>
                <CardTitle className="text-sm font-bold pt-1">{p.providerName}</CardTitle>
                <CardDescription className="text-xs">
                  Capacity: {p.annualTraineeCapacity} Seats/Yr &bull; Track Record: {p.placementTrackRecordPercentage}% Placed
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
