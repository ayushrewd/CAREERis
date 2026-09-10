"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

export default function InterventionBoardPage() {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/interventions/execution")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setInterventions(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">District Intervention Execution Board</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational delivery tracking: Milestone dependencies, procurement timelines, trainer rotations &amp; intake capacity
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {interventions.map((intv) => (
          <Card key={intv.interventionId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={intv.status === "COMPLETED" ? "success" : "secondary"} className="text-[10px] font-mono">
                    {intv.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{intv.category}</Badge>
                  <CardTitle className="text-base font-bold">{intv.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  District: <span className="font-bold text-foreground">{intv.districtId}</span> &bull; Budget: ₹{(intv.allocatedBudgetINR / 10000000).toFixed(2)} Cr
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold font-mono text-primary block">
                  Priority Score: {intv.explainability?.compositePriorityScore}/100
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Capacity: {intv.estimatedCapacity} seats
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="font-bold text-foreground text-[11px] block">Why this intervention is recommended:</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {intv.explainability?.whyThisIntervention}
                </p>
              </div>

              {/* Milestones */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-foreground block">Key Delivery Milestones:</span>
                {intv.milestones?.map((m: any) => (
                  <div key={m.milestoneId} className="p-2 rounded border bg-card flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={m.status === "COMPLETED" ? "success" : "outline"} className="text-[9px]">
                          {m.status}
                        </Badge>
                        <span className="font-bold">{m.title}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        Owner: {m.ownerName} &bull; Due: {new Date(m.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs">{m.completionPercentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
