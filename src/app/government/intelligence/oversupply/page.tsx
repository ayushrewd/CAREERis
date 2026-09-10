"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { CourseOversupplyProfile } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function OversupplyRadarPage() {
  const [reports, setReports] = useState<CourseOversupplyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/oversupply")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReports(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-blue-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-semibold mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Course &amp; Trade Output Balance</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Vocational Oversupply Radar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detecting trades where graduate seating output significantly exceeds relevant market demand
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Output vs Demand Analysis ({reports.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Annual graduate output compared against validated regional hiring volume
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading oversupply diagnostics...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Course &amp; Institute</th>
                    <th className="px-4 py-3 font-semibold text-center">Classification</th>
                    <th className="px-4 py-3 font-semibold text-right">Annual Seats</th>
                    <th className="px-4 py-3 font-semibold text-right">Grad Output</th>
                    <th className="px-4 py-3 font-semibold text-right">Market Demand</th>
                    <th className="px-4 py-3 font-semibold text-right">Oversupply Ratio</th>
                    <th className="px-4 py-3 font-semibold">Recommended Action</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs font-mono">
                  {reports.map((r) => (
                    <tr key={r.courseId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-foreground">{r.courseTitle}</div>
                        <div className="text-[11px] text-muted-foreground">{r.providerName}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-sans">
                        <Badge variant={r.classification === "SEVERELY_OVERSUPPLIED" ? "destructive" : r.classification === "BALANCED" ? "secondary" : "default"}>
                          {r.classification.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">{r.annualSeats}</td>
                      <td className="px-4 py-3 text-right font-semibold">{r.graduateOutput}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{r.relevantDemand.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-bold ${r.oversupplyRatio > 1.2 ? "text-destructive" : "text-emerald-600"}`}>
                        {r.oversupplyRatio}x
                      </td>
                      <td className="px-4 py-3 font-sans text-[11px] text-muted-foreground max-w-xs">
                        {r.recommendedAction}
                      </td>
                      <td className="px-4 py-3 text-right font-sans">
                        <Link href={`/government/courses/${r.courseId}/health`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DataProvenancePanel
        sources={["MSDE Annual Seating Capacity", "State Apprenticeship Feeds", "Employer Survey Aggregates"]}
        timePeriod="2026-Q2 Evaluation"
        confidenceScore={0.94}
        isSyntheticPilotData={false}
        methodology="Calculates exact ratio of verified annual vocational graduates against local industrial cluster hiring volume."
      />
    </div>
  );
}
