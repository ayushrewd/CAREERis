"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  GitCompare,
} from "lucide-react";

export default function InsightsCommandCenterPage() {
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-Q2");
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Comparison widget state
  const [skillA, setSkillA] = useState("skill-bms");
  const [skillB, setSkillB] = useState("skill-plc");
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const url = selectedState === "ALL"
      ? `/api/intelligence/overview?period=${selectedPeriod}`
      : `/api/intelligence/overview?stateCode=${selectedState}&period=${selectedPeriod}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setOverview(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedState, selectedPeriod]);

  const handleCompare = () => {
    fetch(`/api/intelligence/compare?type=SKILL_VS_SKILL&idA=${skillA}&idB=${skillB}&period=${selectedPeriod}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setComparison(data.data);
      })
      .catch(() => {});
  };

  const stateOptions = [
    { code: "ALL", name: "Pan-India National View" },
    { code: "MH", name: "Maharashtra (Western Corridor)" },
    { code: "KA", name: "Karnataka (Southern Tech Hub)" },
    { code: "TN", name: "Tamil Nadu (Automotive Corridor)" },
    { code: "GJ", name: "Gujarat (EV & Clean Energy)" },
    { code: "UP", name: "Uttar Pradesh (NCR & Electronics)" },
    { code: "TS", name: "Telangana (Pharma & AI)" },
    { code: "AS", name: "Assam (North-East Corridor)" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>National Labour-Market Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Labour-Market Demand, Supply &amp; Deficit Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time triangulation of enterprise hiring signals, ITI vocational seating capacity, and verified candidate skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/insights/emerging-skills">
            <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Emerging Skills Radar</span>
            </Button>
          </Link>
          <Link href="/insights/industries">
            <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>Industry Sectors</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Drilldown Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border bg-card shadow-subtle">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Geographic Scope:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-1.5 rounded-lg border bg-background text-xs font-medium w-full sm:w-auto"
          >
            {stateOptions.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-1.5 rounded-lg border bg-background text-xs font-medium font-mono"
          >
            <option value="2026-Q2">2026 Q2 (Current)</option>
            <option value="2026-Q1">2026 Q1</option>
            <option value="2025-Q4">2025 Q4</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">Aggregating National Market Signals...</div>
      ) : overview ? (
        <div className="space-y-6">
          {/* Key Insight Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-primary/30 shadow-xs">
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold">Active Hiring Requisitions</span>
                <div className="text-2xl font-extrabold font-heading text-foreground">
                  {overview.summaryMetrics.totalHiringRequisitions.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">units</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  ↑ {overview.summaryMetrics.averageAnnualYoYGrowth}% YoY Expansion
                </span>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 shadow-xs">
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold">Highest Deficit Competency</span>
                <div className="text-lg font-bold font-heading text-amber-600 dark:text-amber-400 line-clamp-1">
                  {overview.topDemandedSkills[0]?.skillName || "Battery Management Systems (BMS)"}
                </div>
                <span className="text-[10px] text-amber-600 font-semibold block">
                  Deficit Ratio: 6.38x (Severe Shortage)
                </span>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/30 shadow-xs">
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold">Fastest Expanding Industry</span>
                <div className="text-lg font-bold font-heading text-indigo-600 dark:text-indigo-400 line-clamp-1">
                  {overview.topHiringIndustries[0]?.industryName || "EV & Clean Mobility"}
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  Share: {overview.topHiringIndustries[0]?.sharePct}% of total demand
                </span>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/30 shadow-xs">
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold">Model Confidence Index</span>
                <div className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                  {Math.round(overview.summaryMetrics.modelConfidence * 100)}%
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  {overview.summaryMetrics.signalsIngestedCount} multi-source signals ingested
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Active Policy & Training Lag Alerts */}
          {overview.activeAlerts && overview.activeAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Priority Policy &amp; Vocational Lag Alerts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {overview.activeAlerts.map((alt: any) => (
                  <Card key={alt.id} className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{alt.alertType.replace(/_/g, " ")}</span>
                        <Badge variant="warning" className="text-[9px]">{alt.severity}</Badge>
                      </div>
                      <h4 className="font-bold text-xs font-heading text-foreground">{alt.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{alt.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Top In-Demand Skills & Industry Sectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Top Demanded Standard Competencies
                  </h3>
                  <Link href="/skills" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    <span>Taxonomy</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {overview.topDemandedSkills.map((sk: any) => (
                    <div key={sk.skillId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <Link href={`/skills/${sk.skillId}/market`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {sk.skillName}
                        </Link>
                        <span className="font-mono text-muted-foreground font-semibold">
                          {sk.volume.toLocaleString("en-IN")} units ({sk.sharePct}%)
                        </span>
                      </div>
                      <ProgressBar value={sk.sharePct * 2.5} max={100} size="sm" variant="primary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Industrial Sector Requisition Share
                  </h3>
                  <Link href="/insights/industries" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    <span>All Sectors</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {overview.topHiringIndustries.map((ind: any) => (
                    <div key={ind.industryId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{ind.industryName}</span>
                        <span className="font-mono text-muted-foreground font-semibold">
                          {ind.volume.toLocaleString("en-IN")} units ({ind.sharePct}%)
                        </span>
                      </div>
                      <ProgressBar value={ind.sharePct * 2} max={100} size="sm" variant="success" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Normalized Comparison Tool Widget */}
          <Card className="border-indigo-500/30">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Normalized Competency Comparison Engine
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compare demand volume, net gap, tightness, and growth momentum between any two skills.
                  </p>
                </div>
                <Button size="sm" onClick={handleCompare} className="text-xs font-bold gap-1">
                  <span>Compare Skills</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Competency A</label>
                  <select
                    value={skillA}
                    onChange={(e) => setSkillA(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background text-xs font-medium"
                  >
                    <option value="skill-bms">Battery Management Systems (BMS)</option>
                    <option value="skill-plc">Programmable Logic Controllers (PLC)</option>
                    <option value="skill-py">Python</option>
                    <option value="skill-ros">Industrial Robotics (ROS 2)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Competency B</label>
                  <select
                    value={skillB}
                    onChange={(e) => setSkillB(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background text-xs font-medium"
                  >
                    <option value="skill-plc">Programmable Logic Controllers (PLC)</option>
                    <option value="skill-bms">Battery Management Systems (BMS)</option>
                    <option value="skill-ros">Industrial Robotics (ROS 2)</option>
                    <option value="skill-py">Python</option>
                  </select>
                </div>
              </div>

              {comparison && (
                <div className="p-4 rounded-xl border bg-background space-y-3 animate-fade-in text-xs">
                  <p className="text-foreground/90 font-medium">{comparison.deltaSummary}</p>
                  <div className="grid grid-cols-2 gap-3 font-mono text-center">
                    <div className="p-3 rounded-lg bg-muted/40 border">
                      <span className="font-bold text-primary block">{comparison.entityA.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Demand: {comparison.entityA.metrics.annualDemand.toLocaleString("en-IN")} • Tightness: {comparison.entityA.metrics.tightness}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40 border">
                      <span className="font-bold text-indigo-600 block">{comparison.entityB.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Demand: {comparison.entityB.metrics.annualDemand.toLocaleString("en-IN")} • Tightness: {comparison.entityB.metrics.tightness}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reusable Data Provenance Panel */}
          <DataProvenancePanel
            sourceName="CareerIS Unified Labour Market Intelligence Engine"
            period={overview.period}
            confidenceScore={overview.summaryMetrics.modelConfidence}
            isSyntheticPilotData={overview.provenance.isSyntheticPilotData}
          />
        </div>
      ) : null}
    </div>
  );
}
