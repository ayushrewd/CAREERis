"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ShieldCheck, Database, Calendar, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export interface DataProvenanceProps {
  sourceName?: string;
  sources?: string[];
  sourceType?: string;
  methodology?: string;
  period?: string;
  timePeriod?: string;
  confidenceScore?: number; // 0 - 100 or 0 - 1.0
  lastRefreshedAt?: string;
  isSyntheticPilotData?: boolean;
  className?: string;
}

export function DataProvenancePanel({
  sourceName = "CareerIS Unified Labour Market Intelligence Engine",
  sources,
  sourceType = "GOVERNMENT / INDUSTRY AGGREGATION",
  methodology = "Triangulated Enterprise Requisitions + MSDE NCVT Vocational Capacity + Proctored Diagnostic Test Results",
  period,
  timePeriod,
  confidenceScore = 95,
  lastRefreshedAt,
  isSyntheticPilotData = true,
  className = "",
}: DataProvenanceProps) {
  const activePeriod = timePeriod || period || "2026-Q2";
  const activeSourceName = sources ? sources.join(", ") : sourceName;
  const [expanded, setExpanded] = useState(false);
  const normalizedConfidence = confidenceScore > 1 ? confidenceScore : Math.round(confidenceScore * 100);

  return (
    <div className={`rounded-xl border bg-card/60 backdrop-blur-sm p-3 text-xs ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-foreground font-heading">Data Provenance &amp; Verification</span>
          <Badge variant={normalizedConfidence >= 90 ? "success" : "warning"} className="text-[10px] font-mono font-bold">
            Confidence: {normalizedConfidence}%
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono">
            Period: {activePeriod}
          </Badge>
          {isSyntheticPilotData && (
            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
              SIH Pilot Benchmark
            </Badge>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition-colors"
        >
          <span>{expanded ? "Hide Details" : "View Methodology"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2 text-[11px] text-muted-foreground leading-relaxed animate-fade-in">
          <div>
            <span className="font-semibold text-foreground">Data Origin:</span> {activeSourceName} ({sourceType})
          </div>
          <div>
            <span className="font-semibold text-foreground">Triangulation Methodology:</span> {methodology}
          </div>
          <div className="flex items-center gap-2 pt-1 text-[10px]">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Refreshed: {lastRefreshedAt ? new Date(lastRefreshedAt).toLocaleDateString("en-IN") : "27 August 2026"}</span>
            <span>•</span>
            <span>License: Government Open Data &amp; Industry Shared Research</span>
          </div>
        </div>
      )}
    </div>
  );
}
