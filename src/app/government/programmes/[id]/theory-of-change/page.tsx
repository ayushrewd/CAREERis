"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, ArrowRight, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProgrammeTheoryOfChangePage() {
  const params = useParams();
  const id = params.id as string;
  const [tocData, setTocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/programmes/${id}/theory-of-change`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setTocData(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Loading Theory of Change blueprint...</div>;
  if (!tocData) return <div className="p-12 text-center text-sm text-muted-foreground">Programme not found.</div>;

  const toc = tocData.theoryOfChange;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href={`/government/programmes/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Programme Overview
          </Button>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-primary border-primary/30">
            RESULTS ARCHITECTURE BLUEPRINT
          </Badge>
        </div>
        <h1 className="text-xl font-bold font-heading pt-1">
          Theory of Change: {tocData.programmeName}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Logical causal chain connecting capital inputs, activities, measurable outputs, labour outcomes, and national impact
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* 1. Inputs */}
        <Card className="shadow-subtle border-primary/20 flex flex-col justify-between">
          <CardHeader className="p-3 pb-2 bg-muted/20">
            <Badge variant="outline" className="text-[9px] w-fit">1. INPUTS</Badge>
            <CardTitle className="text-xs font-bold pt-1">Financial &amp; Physical Capital</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2 text-xs space-y-2">
            {toc?.inputs?.map((item: string, idx: number) => (
              <div key={idx} className="p-2 rounded bg-card border text-[11px] leading-relaxed">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Activities */}
        <Card className="shadow-subtle border-primary/20 flex flex-col justify-between">
          <CardHeader className="p-3 pb-2 bg-muted/20">
            <Badge variant="outline" className="text-[9px] w-fit">2. ACTIVITIES</Badge>
            <CardTitle className="text-xs font-bold pt-1">Operational Interventions</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2 text-xs space-y-2">
            {toc?.activities?.map((item: string, idx: number) => (
              <div key={idx} className="p-2 rounded bg-card border text-[11px] leading-relaxed">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. Outputs */}
        <Card className="shadow-subtle border-primary/20 flex flex-col justify-between">
          <CardHeader className="p-3 pb-2 bg-muted/20">
            <Badge variant="outline" className="text-[9px] w-fit">3. OUTPUTS</Badge>
            <CardTitle className="text-xs font-bold pt-1">Direct Deliverables</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2 text-xs space-y-2">
            {toc?.outputs?.map((item: string, idx: number) => (
              <div key={idx} className="p-2 rounded bg-card border text-[11px] leading-relaxed">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 4. Outcomes */}
        <Card className="shadow-subtle border-emerald-500/30 flex flex-col justify-between">
          <CardHeader className="p-3 pb-2 bg-emerald-500/10">
            <Badge variant="success" className="text-[9px] w-fit">4. OUTCOMES</Badge>
            <CardTitle className="text-xs font-bold pt-1 text-emerald-600 dark:text-emerald-400">
              Employment &amp; Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2 text-xs space-y-2">
            {toc?.outcomes?.map((item: string, idx: number) => (
              <div key={idx} className="p-2 rounded bg-card border border-emerald-500/20 text-[11px] leading-relaxed">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 5. Impact */}
        <Card className="shadow-subtle border-primary/30 flex flex-col justify-between">
          <CardHeader className="p-3 pb-2 bg-primary/10">
            <Badge variant="outline" className="text-[9px] w-fit text-primary border-primary/30">5. IMPACT</Badge>
            <CardTitle className="text-xs font-bold pt-1 text-primary">National Transformation</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2 text-xs space-y-2">
            {toc?.impact?.map((item: string, idx: number) => (
              <div key={idx} className="p-2 rounded bg-card border border-primary/20 text-[11px] leading-relaxed">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
