"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Shield, Sparkles, FileText, CheckCircle2, Building2, Layers, ArrowUpRight } from "lucide-react";

export default function IndustryCouncilDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-purple-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center font-bold text-xl font-heading shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-foreground">
                Automotive &amp; Electronics Sector Skill Council
              </h1>
              <Badge variant="purple" className="text-[10px]">
                National Standards Body
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              National Occupational Standards (NOS) &bull; QP Validation &bull; Industry Demand Radar
            </p>
          </div>
        </div>

        <Button className="text-xs font-semibold gap-1.5 self-start md:self-auto">
          <Sparkles className="w-4 h-4" />
          Publish New Skill Standard
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active QP Standards"
          value="48 Qualification Packs"
          change="NSQF Level 3-7"
          isPositive={true}
          icon={<Shield className="w-4 h-4" />}
        />
        <StatCard
          title="Emerging Skills Under Review"
          value="8 Standards"
          change="EV, AI, OSAT"
          isPositive={true}
          icon={<Sparkles className="w-4 h-4" />}
        />
        <StatCard
          title="Consulted Employers"
          value="450+ Companies"
          change="SIH Survey"
          isPositive={true}
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard
          title="Assessment Integrity"
          value="99.4%"
          change="Proctored Grid"
          isPositive={true}
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>

      {/* Standards & Surveys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Qualification Packs &amp; Occupational Standards</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Harmonizing vocational training with real industrial competency benchmarks.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                { qp: "QP-AUTO-BMS-09", title: "EV Battery Calibration & Diagnostics Engineer", level: "NSQF Level 6", status: "Published 2026.1", jobs: 3840 },
                { qp: "QP-MFG-ROB-04", title: "Autonomous Mobile Robot (AMR) Specialist", level: "NSQF Level 5", status: "Under Industry Review", jobs: 1950 },
                { qp: "QP-SEMI-PKG-02", title: "Semiconductor Assembly & Wire Bonding Operator", level: "NSQF Level 4", status: "Published 2025.4", jobs: 2400 },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] bg-background border px-1.5 py-0.5 rounded text-primary font-bold">
                        {item.qp}
                      </span>
                      <h4 className="font-semibold text-foreground text-sm mt-1">
                        {item.title}
                      </h4>
                    </div>
                    <Badge variant={item.status.includes("Published") ? "success" : "warning"} className="text-[9px]">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between text-muted-foreground text-[11px]">
                    <span>{item.level}</span>
                    <span className="font-semibold text-foreground">{item.jobs.toLocaleString()} Requisitions Linked</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Employer Survey Pulse */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Industry Demand Survey Pulse</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Feedback from Chakan &amp; Electronic City HR leaders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border bg-card space-y-1">
                <p className="font-semibold text-foreground">Top Skill Deficit in 2026:</p>
                <p className="text-muted-foreground text-[11px]">
                  &ldquo;Candidates lack practical experience with CAN protocol packet inspection and high-voltage safety isolation.&rdquo;
                </p>
                <span className="text-[10px] text-primary font-medium block pt-1">
                  — Tata Motors &amp; Tier-1 Supplier Round Table
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
