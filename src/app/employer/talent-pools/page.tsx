"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, Filter, ShieldCheck, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function EmployerTalentPoolsPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/employer/talent-pools")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPools(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Users className="w-3.5 h-3.5 mr-1" /> TALENT POOLS &amp; PIPELINES
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Dynamic Candidate Talent Pools
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-matched candidate pools based on verified Skill Passport criteria, assessment thresholds &amp; regional clusters
          </p>
        </div>

        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Create Talent Pool
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pools.map((p) => (
          <Card key={p.poolId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold">{p.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs pt-1">{p.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs shrink-0">
                  {p.candidateCount} Verified
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="flex flex-wrap gap-1">
                  {p.tags?.map((t: string) => (
                    <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                  <span className="font-bold text-foreground text-[11px] block">Matching Criteria:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.filterCriteria?.skills?.map((s: string) => (
                      <Badge key={s} variant="success" className="text-[9px]">✓ {s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1">
                <Link href="/employer/candidates">
                  View Pool Candidates <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
