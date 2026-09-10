"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, Play, Zap } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function TrainingLabsEquipmentPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/training/labs").then((r) => r.json()),
      fetch("/api/training/equipment").then((r) => r.json()),
    ])
      .then(([labRes, eqRes]) => {
        if (labRes.success) setLabs(labRes.data || []);
        if (eqRes.success) setEquipment(eqRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSimulate = async (equipmentId: string) => {
    setSimulating(true);
    try {
      const res = await fetch("/api/training/equipment/simulate-failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipmentId }),
      });
      const data = await res.json();
      if (data.success) setSimResult(data.data);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Labs &amp; Equipment Intelligence &amp; Failure Simulator</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Technical bay utilization, hardware readiness &amp; preventive maintenance failure impact simulation
          </p>
        </div>
      </div>

      {/* Equipment Failure Simulation Result Card */}
      {simResult && (
        <Card className="shadow-subtle border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-[10px] font-bold font-mono">
                  {simResult.label}
                </Badge>
                <CardTitle className="text-sm font-bold">{simResult.equipmentName} Failure Impact</CardTitle>
              </div>
              <CardDescription className="text-[11px] text-amber-700 dark:text-amber-300">
                {simResult.disclaimer}
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setSimResult(null)}>Dismiss</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-2.5 rounded-lg border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground block">Affected Students</span>
              <span className="text-lg font-bold text-foreground">{simResult.affectedStudentsCount} Trainees</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground block">Placement Conversion Impact</span>
              <span className="text-lg font-bold text-destructive">{simResult.potentialPlacementImpactPercentage}%</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground block">Est. Repair Cost</span>
              <span className="text-lg font-bold text-foreground">{formatCurrencyINR(simResult.estimatedRepairCostINR)}</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground block">Preventive Action</span>
              <span className="text-[11px] font-medium text-foreground">{simResult.recommendedPreventiveAction}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labs Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Technical Labs &amp; Workstation Uptime</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labs.map((l) => (
            <Card key={l.labId} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[10px]">{l.operationalStatus}</Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">{l.utilizationRatePercentage}% Uptime</Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{l.labName}</CardTitle>
                <CardDescription className="text-xs">{l.instituteName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-[11px] text-muted-foreground">{l.capacityWorkstations} Workstations &bull; {l.equipmentItemsCount} Hardware Rigs</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipment Inventory */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Hardware Inventory &amp; Failure Simulator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipment.map((eq) => (
            <Card key={eq.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">{eq.category}</Badge>
                  <Badge variant="success" className="text-[10px]">{eq.readinessStatus}</Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{eq.equipmentName}</CardTitle>
                <CardDescription className="text-xs">{eq.labName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-bold text-foreground">{eq.operationalQuantity} / {eq.totalQuantity} Operational</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  onClick={() => handleSimulate(eq.id)}
                  disabled={simulating}
                >
                  <Play className="w-3 h-3" /> Simulate Failure Impact &rarr;
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
