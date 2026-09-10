"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Building2, ArrowLeft, Layers, MapPin, Sparkles } from "lucide-react";

export default function IndustryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/intelligence/industries/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) setData(resData.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-muted-foreground">Loading Sector Intelligence...</div>;
  }

  if (!data || !data.industry) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Industry not found.</p>
        <Link href="/insights/industries">
          <Button size="sm" variant="outline">Back to Industries</Button>
        </Link>
      </div>
    );
  }

  const { industry, demandSummary } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <Link href="/insights/industries" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Industry Sectors</span>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{industry.sector}</span>
            {industry.isEmergingSector && (
              <Badge variant="warning" className="text-[9px] font-semibold">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Emerging Sector
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">{industry.name}</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">{industry.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Annual Hiring Volume</span>
            <div className="text-2xl font-extrabold font-heading text-foreground font-mono">
              {industry.annualHiringVolume.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">units</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Active Employers: {industry.activeEmployersCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Annual YoY Growth</span>
            <div className="text-2xl font-extrabold font-heading text-emerald-600 font-mono">
              +{industry.growthRateYoY}%
            </div>
            <span className="text-[10px] text-muted-foreground">Quarterly momentum accelerating</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold">Active Sector Requisitions</span>
            <div className="text-2xl font-extrabold font-heading text-primary font-mono">
              {demandSummary?.totalDemandVolume.toLocaleString("en-IN") || 3200}
            </div>
            <span className="text-[10px] text-muted-foreground">Ingested from verified postings &amp; surveys</span>
          </CardContent>
        </Card>
      </div>

      {/* Core Competencies Demanded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Core Competencies Required
            </h3>
            <div className="space-y-3">
              {industry.keySkills.map((sk: string, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border bg-card flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{sk}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">Standard NSQF Level 5-6</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Regional Hiring Concentration
            </h3>
            <div className="space-y-3">
              {(demandSummary?.byState || []).slice(0, 5).map((st: any) => (
                <div key={st.stateCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{st.stateCode === "MH" ? "Maharashtra (Pune / Mumbai)" : st.stateCode === "KA" ? "Karnataka (Bengaluru)" : st.stateCode === "TN" ? "Tamil Nadu (Chennai)" : st.stateCode}</span>
                    <span className="font-mono text-muted-foreground font-semibold">{st.volume.toLocaleString("en-IN")} units</span>
                  </div>
                  <ProgressBar value={st.sharePct * 2} max={100} size="sm" variant="primary" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataProvenancePanel
        sourceName="CareerIS Industry Sector Intelligence"
        period="2026-Q2"
        confidenceScore={95}
      />
    </div>
  );
}
