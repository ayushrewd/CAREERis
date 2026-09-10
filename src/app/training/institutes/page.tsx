"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TrainingInstitutesListPage() {
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/training/institutes")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setInstitutes(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = institutes.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.districtName.toLowerCase().includes(search.toLowerCase()) ||
      i.stateName.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-xl font-bold font-heading">Pan-India Training Institutes &amp; Centers of Excellence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational governance, seat capacities, equipment readiness, and 10-dimension health scores
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search institute name, district, state, or affiliation..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inst) => (
          <Card key={inst.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">{inst.type}</Badge>
                <Badge
                  variant={inst.healthClassification === "EXCELLENT" ? "success" : inst.healthClassification === "HEALTHY" ? "default" : "warning"}
                  className="text-[10px]"
                >
                  Health: {inst.overallHealthScore}/100
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{inst.name}</CardTitle>
              <CardDescription className="text-xs">{inst.districtName}, {inst.stateName} &bull; Affiliation: {inst.affiliation}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Seats</span>
                  <span className="font-bold text-foreground">{inst.totalSanctionedSeats}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Trainers</span>
                  <span className="font-bold text-foreground">{inst.totalActiveTrainers}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Placement</span>
                  <span className="font-bold text-emerald-600">{inst.averagePlacementRatePercentage}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="text-muted-foreground">{inst.activeCoursesCount} Courses &bull; {inst.employerPartnershipsCount} Partners</span>
                <Link href={`/training/institutes/${inst.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    Dossier <ArrowRight className="w-3 h-3" />
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
