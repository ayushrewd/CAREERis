"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Globe,
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
} from "lucide-react";
import Link from "next/link";
import { CourseHealthProfile, CurriculumHealthDetail, TrainerProfile, EquipmentGapMetric } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function CourseHealthDetailPage() {
  const params = useParams();
  const courseId = params?.id as string || "course-bms-01";

  const [health, setHealth] = useState<CourseHealthProfile | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumHealthDetail | null>(null);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [equipmentGaps, setEquipmentGaps] = useState<EquipmentGapMetric[]>([]);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "CURRICULUM" | "TRAINERS" | "EQUIPMENT" | "RISKS">("OVERVIEW");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/intelligence/courses/${courseId}/health`).then((r) => r.json()),
      fetch(`/api/intelligence/courses/${courseId}/curriculum`).then((r) => r.json()),
      fetch(`/api/intelligence/courses/${courseId}/trainers`).then((r) => r.json()),
      fetch(`/api/intelligence/courses/${courseId}/equipment`).then((r) => r.json()),
    ])
      .then(([hRes, cRes, tRes, eRes]) => {
        if (hRes.success) setHealth(hRes.data);
        if (cRes.success) setCurriculum(cRes.data);
        if (tRes.success) setTrainers(tRes.data);
        if (eRes.success) setEquipmentGaps(eRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading || !health) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground">
        Loading Course Health &amp; Vocational Alignment Profile...
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

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono">
              ID: {health.courseId}
            </Badge>
            <Badge variant={health.classification === "EXCELLENT" ? "default" : health.classification === "CRITICAL" ? "destructive" : "secondary"}>
              {health.classification}
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading text-foreground">
            {health.courseTitle}
          </h1>
          <p className="text-xs text-muted-foreground">
            {health.providerName} • {health.district}, {health.state} • NVQF Rule Version: <strong>{health.weightVersion}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-background border text-center shrink-0 min-w-[130px]">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Health Score</div>
          <div className="text-3xl font-bold font-mono text-primary">{health.overallScore}/100</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Confidence: {health.confidence * 100}%</div>
        </div>
      </div>

      {/* 13-Tab Navigation Bar */}
      <div className="flex items-center gap-1 border-b pb-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "OVERVIEW" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview &amp; 7-D Scores
        </button>
        <button
          onClick={() => setActiveTab("CURRICULUM")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "CURRICULUM" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Curriculum &amp; Freshness ({curriculum?.modules.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("TRAINERS")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "TRAINERS" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Faculty &amp; Trainers ({trainers.length})
        </button>
        <button
          onClick={() => setActiveTab("EQUIPMENT")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "EQUIPMENT" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Lab Equipment &amp; Rigs ({equipmentGaps.length})
        </button>
        <button
          onClick={() => setActiveTab("RISKS")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "RISKS" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Obsolescence &amp; Recommendations
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border shadow-subtle p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">7-Dimension Health Component Scores</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Market Demand Alignment (25% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.marketDemandAlignment}%</span>
                  </div>
                  <ProgressBar value={health.components.marketDemandAlignment} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Skill Alignment (20% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.skillAlignment}%</span>
                  </div>
                  <ProgressBar value={health.components.skillAlignment} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Placement Performance (20% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.placementPerformance}%</span>
                  </div>
                  <ProgressBar value={health.components.placementPerformance} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Curriculum Freshness (15% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.curriculumFreshness}%</span>
                  </div>
                  <ProgressBar value={health.components.curriculumFreshness} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Employer Satisfaction (10% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.employerSatisfaction}%</span>
                  </div>
                  <ProgressBar value={health.components.employerSatisfaction} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Emerging Skill Exposure (5% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.emergingSkillCoverage}%</span>
                  </div>
                  <ProgressBar value={health.components.emergingSkillCoverage} />
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Capacity Utilization (5% wt)</span>
                    <span className="font-mono font-bold text-foreground">{health.components.capacityUtilization}%</span>
                  </div>
                  <ProgressBar value={health.components.capacityUtilization} />
                </div>
              </div>
            </Card>

            <Card className="border shadow-subtle p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Explainable Health Rationale</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {health.rationale}
              </p>
              <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-2 border">
                <div className="font-semibold text-foreground">Data Sources Evaluated:</div>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  {health.sources.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Curriculum */}
      {activeTab === "CURRICULUM" && curriculum && (
        <div className="space-y-4">
          <Card className="border shadow-subtle p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Modular Curriculum Breakdown</h3>
            <div className="space-y-3">
              {curriculum.modules.map((m) => (
                <div key={m.id} className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-foreground">{m.title}</div>
                    <div className="text-[11px] text-muted-foreground">Skill: {m.skillName} • Target: {m.targetProficiency}</div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-muted-foreground shrink-0">
                    <div>{m.theoryHours}h Theory / {m.practicalLabHours}h Lab</div>
                    <Badge variant={m.status === "MET" ? "default" : "destructive"} className="text-[10px] mt-1">
                      {m.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Trainers */}
      {activeTab === "TRAINERS" && (
        <Card className="border shadow-subtle p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Assigned Vocational Faculty</h3>
          {trainers.length === 0 ? (
            <div className="text-xs text-muted-foreground">No faculty currently assigned.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trainers.map((t) => (
                <div key={t.id} className="p-3 rounded-xl border bg-muted/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <Badge variant="secondary" className="text-[10px]">{t.status}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Weekly Capacity: {t.weeklyCapacityHours} hours</div>
                  <div className="flex flex-wrap gap-1">
                    {t.competencies.map((c, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                        {c.skillName} ({c.proficiency})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Equipment */}
      {activeTab === "EQUIPMENT" && (
        <Card className="border shadow-subtle p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Laboratory Rigs &amp; Workbench Audit</h3>
          <div className="space-y-3">
            {equipmentGaps.map((eq, idx) => (
              <div key={idx} className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-semibold text-foreground">{eq.category}</div>
                  <div className="text-[11px] text-muted-foreground">Required: {eq.requiredUnits} units • Operational: {eq.operationalUnits} units</div>
                </div>
                <div className="text-right">
                  <Badge variant={eq.severity === "LOW" ? "secondary" : "destructive"}>
                    {eq.severity === "LOW" ? "Optimal" : `${eq.netGap} Rig Shortage`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Risks */}
      {activeTab === "RISKS" && (
        <Card className="border shadow-subtle p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Obsolescence &amp; Governance Review Recommendations</h3>
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs leading-relaxed space-y-2">
            <div className="font-bold text-foreground">Recommended Policy Actions:</div>
            <p className="text-muted-foreground">
              {curriculum?.recommendedAction || "Maintain active enrollment and coordinate campus hiring drives."}
            </p>
          </div>
        </Card>
      )}

      <DataProvenancePanel
        sources={health.sources}
        timePeriod={health.period}
        confidenceScore={health.confidence}
        isSyntheticPilotData={health.isDemoData}
        methodology="Explainable 7-dimension weighted evaluation against live employer job openings, institutional seating, and verified graduate outcomes."
      />
    </div>
  );
}
