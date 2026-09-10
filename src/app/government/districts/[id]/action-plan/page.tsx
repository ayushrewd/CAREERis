"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Users,
  ShieldCheck,
  Building2,
  Layers,
  ArrowLeft,
  ArrowRight,
  Cpu,
  GraduationCap,
  Scale,
  Sparkles,
  CheckCircle2,
  Clock,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { DistrictSkillAndTrainingProfile, InterventionRecord } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function DistrictActionPlanPage() {
  const params = useParams();
  const districtId = params?.id as string || "dist-mh-pun";

  const [profile, setProfile] = useState<DistrictSkillAndTrainingProfile | null>(null);
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/intelligence/districts/${districtId}/action-plan`).then((r) => r.json()),
      fetch(`/api/intelligence/interventions?districtId=${districtId}`).then((r) => r.json()),
    ])
      .then(([pRes, iRes]) => {
        if (pRes.success) setProfile(pRes.data);
        if (iRes.success) setInterventions(iRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [districtId]);

  const handleApproveIntervention = async (interventionId: string) => {
    try {
      const res = await fetch(`/api/intelligence/interventions/${interventionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE", approvedBy: "Directorate of Vocational Education (DVET)" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Intervention ${interventionId} approved successfully by authorized government reviewer.`);
        // Refresh
        const refresh = await fetch(`/api/intelligence/interventions?districtId=${districtId}`).then((r) => r.json());
        if (refresh.success) setInterventions(refresh.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground">
        Loading District Vocational Action Plan &amp; Intelligence Profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Back Button */}
      <div>
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Government Command Center</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>District Skill &amp; Training Action Plan</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            {profile.districtName} District Action Plan ({profile.stateCode})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational Decision Support for District Skill Committees &amp; Industrial Corridors
          </p>
        </div>

        <Badge variant="outline" className="text-xs px-3 py-1 font-mono">
          Assessment Period: {profile.period}
        </Badge>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cluster Employer Demand"
          value={profile.summaryMetrics.totalDemand.toLocaleString()}
          change="Annual Requisitions"
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          title="Overall Skill Deficit"
          value={`+${profile.summaryMetrics.overallNetGap.toLocaleString()}`}
          change="Net Unfilled Gap"
          changeType="negative"
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <StatCard
          title="Trainer Shortages"
          value={`${profile.summaryMetrics.trainerShortageCount} Instructors`}
          change="Retraining Target"
          changeType="neutral"
          icon={<GraduationCap className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Equipment Lab Gaps"
          value={`${profile.summaryMetrics.equipmentShortageCount} Workbenches`}
          change="Sanctioned Rigs"
          changeType="neutral"
          icon={<Cpu className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      {/* Priority Skills in District */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Priority Competencies &amp; Labour Tightness
          </CardTitle>
          <CardDescription className="text-xs">
            High-deficit skills demanding targeted government intervention in {profile.districtName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Skill Competency</th>
                  <th className="px-4 py-3 font-semibold text-right">Cluster Demand</th>
                  <th className="px-4 py-3 font-semibold text-right">Net Deficit</th>
                  <th className="px-4 py-3 font-semibold text-center">Market Tightness</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs font-mono">
                {profile.prioritySkills.map((ps) => (
                  <tr key={ps.skillId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-sans font-semibold text-foreground">{ps.skillName}</td>
                    <td className="px-4 py-3 text-right">{ps.demand.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-destructive font-bold">+{ps.netGap.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center font-sans">
                      <Badge variant={ps.tightness === "VERY_TIGHT" ? "destructive" : "secondary"}>
                        {ps.tightness}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <Link href={`/insights/skills/${ps.skillId}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Trace
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Interventions (System Detects -> System Recommends -> Human Approves) */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-bold font-heading">
              Recommended Policy Interventions ({profile.recommendations.length})
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            System-generated proposals requiring human administrative review and sign-off
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {profile.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority === "CRITICAL" ? "destructive" : "default"}>
                    {rec.priority} PRIORITY
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Complexity: <strong>{rec.estimatedImplementationComplexity}</strong>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rec.description}
              </p>
              <div className="p-2.5 rounded-lg bg-background border text-[11px] text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <strong>Expected Impact:</strong> {rec.expectedImpact}
                </div>
                <div>
                  <strong>Target Beneficiaries:</strong> {rec.affectedPopulation} Candidates
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active & Approved Interventions Tracker */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Government Sanctioned Interventions &amp; Outcome Tracking</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Measurable milestone tracking across baseline, targets, and actual verified outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {interventions.map((intv) => (
            <div key={intv.id} className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={intv.status === "COMPLETED" ? "default" : intv.status === "IN_PROGRESS" ? "secondary" : "outline"}>
                      {intv.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">{intv.title}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Owner: {intv.ownerName} • Timeline: {intv.timelineMonths} months
                  </div>
                </div>

                {intv.status === "PROPOSED" || intv.status === "UNDER_REVIEW" ? (
                  <Button size="sm" onClick={() => handleApproveIntervention(intv.id)} className="h-8 text-xs gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve Intervention</span>
                  </Button>
                ) : (
                  <div className="text-right font-mono text-xs">
                    <span className="text-muted-foreground">Baseline: {intv.baselineValue} → </span>
                    <span className="text-primary font-bold">Target: {intv.targetValue}</span>
                    {intv.actualValue && <div className="text-emerald-600 font-bold">Actual: {intv.actualValue}</div>}
                  </div>
                )}
              </div>

              {intv.approvalNotes && (
                <div className="p-2.5 rounded-lg bg-muted/40 text-[11px] text-muted-foreground border">
                  <strong>Approval Order:</strong> {intv.approvalNotes} (Approved by: {intv.approvedBy})
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <DataProvenancePanel
        sources={["District Skill Committee Annual Action Plan", "DVET Seating Registry", "State Industry Requisitions"]}
        timePeriod={profile.period}
        confidenceScore={profile.confidence}
        isSyntheticPilotData={false}
        methodology="Triangulates cluster vacancies with active training institute capacity to produce auditable intervention proposals."
      />
    </div>
  );
}
