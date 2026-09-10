"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight, IndianRupee, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function GovernmentProgrammesPage() {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/programmes")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProgrammes(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">National &amp; State Skill Programme Portfolio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            End-to-end lifecycle operations, Theory of Change blueprints, funding tranches &amp; EPFO outcome tracking
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {programmes.map((p) => (
          <Card key={p.programmeId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] font-mono">{p.status}</Badge>
                  <Badge variant="outline" className="text-[10px]">{p.scopeLevel}</Badge>
                  <CardTitle className="text-base font-bold">{p.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Lead Agency: <span className="font-bold text-foreground">{p.leadAgency}</span> &bull; Code: {p.code}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Link href={`/government/programmes/${p.programmeId}/theory-of-change`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Theory of Change
                  </Button>
                </Link>
                <Link href={`/government/programmes/${p.programmeId}/evaluation`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    <FileText className="w-3.5 h-3.5" /> Impact Report
                  </Button>
                </Link>
                <Link href={`/government/programmes/${p.programmeId}`}>
                  <Button size="sm" className="text-xs h-7 px-2.5 gap-1">
                    Overview <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">{p.problemStatement}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Total Budget</span>
                  <span className="font-mono font-bold text-foreground">₹{(p.totalBudgetINR / 10000000).toFixed(1)} Cr</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Utilized Funding</span>
                  <span className="font-mono font-bold text-emerald-600">₹{(p.utilizedBudgetINR / 10000000).toFixed(1)} Cr</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Utilization Rate</span>
                  <span className="font-mono font-bold text-primary">
                    {((p.utilizedBudgetINR / p.totalBudgetINR) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Programme Owner</span>
                  <span className="text-[10px] font-bold text-foreground truncate block">{p.ownerName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
