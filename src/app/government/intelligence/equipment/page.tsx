"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { EquipmentGapMetric } from "@/types/decisionIntelligence";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";

export default function EquipmentIntelligencePage() {
  const [gaps, setGaps] = useState<EquipmentGapMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/equipment/gaps")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGaps(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-indigo-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Vocational Lab Hardware &amp; Workbenches</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Equipment Shortage &amp; Maintenance Diagnostics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational testbeds, student-to-rig ratios, and lab capacity impact
          </p>
        </div>
      </div>

      {/* Equipment Gaps Table */}
      <Card className="border shadow-subtle">
        <CardHeader className="p-5 pb-3 border-b">
          <CardTitle className="text-base font-bold font-heading">
            Laboratory Infrastructure Inventory
          </CardTitle>
          <CardDescription className="text-xs">
            Operational vs required training equipment based on 4-student-per-workbench standard
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading lab equipment audit...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Course &amp; Trade</th>
                    <th className="px-4 py-3 font-semibold">Equipment Category</th>
                    <th className="px-4 py-3 font-semibold text-right">Required Units</th>
                    <th className="px-4 py-3 font-semibold text-right">Operational Units</th>
                    <th className="px-4 py-3 font-semibold text-right">Lab Deficit</th>
                    <th className="px-4 py-3 font-semibold text-center">Maintenance Risk</th>
                    <th className="px-4 py-3 font-semibold text-right">Capacity Impact</th>
                    <th className="px-4 py-3 font-semibold text-right">Affected Learners</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs font-mono">
                  {gaps.map((g, idx) => (
                    <tr key={`${g.courseId}-${idx}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-foreground">{g.courseTitle}</div>
                      </td>
                      <td className="px-4 py-3 font-sans text-muted-foreground">{g.category}</td>
                      <td className="px-4 py-3 text-right">{g.requiredUnits}</td>
                      <td className="px-4 py-3 text-right font-semibold">{g.operationalUnits}</td>
                      <td className={`px-4 py-3 text-right font-bold ${g.netGap > 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {g.netGap > 0 ? `-${g.netGap}` : "0"}
                      </td>
                      <td className="px-4 py-3 text-center font-sans">
                        <Badge variant={g.maintenanceRisk === "SEVERE" ? "destructive" : g.maintenanceRisk === "ELEVATED" ? "default" : "secondary"}>
                          {g.maintenanceRisk}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-destructive font-semibold">
                        {g.estimatedCapacityImpact > 0 ? `-${g.estimatedCapacityImpact}%` : "0%"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold font-sans text-foreground">
                        {g.affectedLearners} Students
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
        sources={["State ITI Physical Infrastructure Audit", "AICTE Lab Norms Registry"]}
        timePeriod="2026-Q2 Physical Audit"
        confidenceScore={0.96}
        isSyntheticPilotData={false}
        methodology="Evaluates physical operational workbenches against batch enrollment to determine simulated training capacity loss."
      />
    </div>
  );
}
