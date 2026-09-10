"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Building2, MapPin, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CandidateEmployersPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/candidate/employers").then((r) => r.json());
        if (res.success) setEmployers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs border-primary/30">
              <Building2 className="w-3 h-3 mr-1" />
              Target Hiring Enterprises
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Target Employers &amp; Industrial Partners
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Enterprises actively recruiting for Battery Management Systems (BMS), PLC automation, and robotics in Maharashtra and Karnataka.
          </p>
        </div>
      </div>

      {/* Employers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employers.map((emp) => (
          <Card key={emp.companyId} className="bg-card/80 hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <Badge variant="success" className="text-[10px] font-mono">
                  {emp.matchScore}% Match Score
                </Badge>
              </div>
              <CardTitle className="text-base font-bold font-heading text-foreground mt-2">
                {emp.companyName}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {emp.headquarters}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs border-t border-border/40 pt-3">
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                {emp.description}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-foreground">Matching Core Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {emp.matchingSkills?.map((s: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      ✓ {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-foreground">Top Open Positions:</span>
                {(emp.topVacancies || []).map((vac: any, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-muted/40 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground truncate max-w-[160px]">{vac.title}</span>
                    <span className="font-mono text-muted-foreground">{vac.salaryRange}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="sm" className="w-full text-xs gap-1.5 mt-2">
                <Link href={`/jobs?search=${encodeURIComponent(emp.companyName)}`}>
                  View {emp.activeJobsCount} Openings
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataProvenancePanel
        sources={["CareerIS Enterprise Employer Directory", "Corporate Recruitment Portals"]}
        timePeriod="2026-Q2 Live"
        confidenceScore={96}
        methodology="Corporate Hiring Profile Matching with Skill Graph Interoperability"
        isSyntheticPilotData={false}
      />
    </div>
  );
}
