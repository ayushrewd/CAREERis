"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Users, ShieldCheck, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { CANONICAL_ESG_SUMMARY } from "@/data/canonicalProgrammeOperationsData";

export default function GovernmentESGPage() {
  const esg = CANONICAL_ESG_SUMMARY;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">
              <Leaf className="w-3.5 h-3.5 mr-1" /> SUSTAINABILITY &amp; GOVERNANCE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            ESG &amp; Green Skills Transformation Framework
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitoring national green job creation, gender inclusion in technical trades &amp; auditable public governance standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Environmental */}
        <Card className="shadow-subtle border-emerald-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base font-bold">Environmental (Green Skills)</CardTitle>
            </div>
            <CardDescription className="text-xs">EV, Solar PV &amp; Clean Hydrogen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Green Demand Index:</span>
                <span className="font-mono font-bold text-emerald-600">{esg.greenSkillsDemandIndex}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Green Training Capacity:</span>
                <span className="font-mono font-bold text-foreground">{esg.greenTrainingCapacityTotal?.toLocaleString()} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified Green Placements:</span>
                <span className="font-mono font-bold text-emerald-600">{esg.greenJobPlacementsCount?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social */}
        <Card className="shadow-subtle border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-bold">Social (Equity &amp; Inclusion)</CardTitle>
            </div>
            <CardDescription className="text-xs">Gender Diversity in Technical ITIs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg border bg-primary/5 border-primary/20 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female Technical Enrolment:</span>
                <span className="font-mono font-bold text-primary">{esg.socialEquityInclusionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rural Cluster Reach:</span>
                <span className="font-mono font-bold text-foreground">100% Districts Covered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance */}
        <Card className="shadow-subtle border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-foreground" />
              <CardTitle className="text-base font-bold">Governance (Accountability)</CardTitle>
            </div>
            <CardDescription className="text-xs">Four-Eyes Controls &amp; Audits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Four-Eyes Compliance:</span>
                <span className="font-mono font-bold text-emerald-600">{esg.governanceComplianceScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audit Trail Completeness:</span>
                <span className="font-mono font-bold text-foreground">100% Immutable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
