"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentStatesListPage() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/government/states")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStates(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = states.filter(
    (s) =>
      s.stateName.toLowerCase().includes(query.toLowerCase()) ||
      s.stateCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">State &amp; Union Territory Intelligence Dossiers</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            State-level aggregated demand, verified talent supply, training capacity, and active interventions
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by state name or code..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((st) => (
          <Card key={st.stateCode} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">{st.stateCode}</Badge>
                <Badge
                  variant={st.priorityCategory === "CRITICAL" ? "destructive" : st.priorityCategory === "HIGH" ? "warning" : "secondary"}
                  className="text-[10px]"
                >
                  {st.priorityCategory}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{st.stateName}</CardTitle>
              <CardDescription className="text-xs">{st.totalDistrictsCount} Districts &bull; {st.totalIndustrialClustersCount} Industrial Hubs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg border bg-muted/20">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Annual Demand</span>
                  <span className="font-bold text-foreground">{st.annualEmployerDemand?.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Net Deficit Gap</span>
                  <span className="font-bold text-rose-600 font-mono">-{st.netSkillGap?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="text-muted-foreground">{st.activeInterventionsCount} Active Interventions</span>
                <Link href={`/government/states/${st.stateCode}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    State Dossier <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
