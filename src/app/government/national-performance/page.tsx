"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, TrendingUp, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import Link from "next/link";

export default function NationalPerformancePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">National Performance &amp; Outcome Rollup (India)</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pan-India aggregation of certified candidates, EPFO verified placements, 365-day retention &amp; high-tech skill transitions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">Total National Beneficiaries</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-primary">27,570</span>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">Total Certified</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-foreground">24,860</span>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">National Placement Rate</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-emerald-600">86.4%</span>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">365-Day Retention Rate</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <span className="text-2xl font-bold font-mono text-foreground">88.5%</span>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Key National Skill Mission Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            1. <strong>Automotive &amp; EV:</strong> 18 COE labs operational across Pune, Chennai, and Sanand; 4,210 technicians certified with 89.4% 1-year retention.
          </p>
          <p>
            2. <strong>Precision Engineering:</strong> 48 5-axis CNC simulation labs equipped across national ITI networks; 1,850 candidates trained in aerospace machining.
          </p>
          <p>
            3. <strong>Clean Energy:</strong> Solar PV and Green Hydrogen technician training frameworks launched in 12 coastal and renewable energy clusters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
