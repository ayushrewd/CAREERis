"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, ArrowLeft, ArrowRight, Search, Filter, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function GovernmentDistrictMatrixPage() {
  const [matrix, setMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/government/districts/matrix")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setMatrix(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = matrix.filter((row) => {
    const matchesSearch =
      row.districtName.toLowerCase().includes(query.toLowerCase()) ||
      row.stateName.toLowerCase().includes(query.toLowerCase()) ||
      row.industrialCluster?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || row.priorityCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-xl font-bold font-heading">District Skill Gap Matrix &amp; Priority Engine</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time supply vs demand deficit classification across industrial clusters
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search district, state, or industrial corridor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={filterCategory === cat ? "default" : "outline"}
              className="text-xs h-8"
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <Card className="shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">District &amp; State</th>
                <th className="p-3">Industrial Cluster</th>
                <th className="p-3">Priority Score</th>
                <th className="p-3">Top Deficit Skill</th>
                <th className="p-3">Gap Status</th>
                <th className="p-3">Active Interventions</th>
                <th className="p-3 text-right">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((row) => (
                <tr key={row.districtId} className="hover:bg-muted/10 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{row.districtName}</span>
                    <span className="text-[10px] text-muted-foreground">{row.stateName} ({row.stateCode})</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {row.industrialCluster || "General Industrial Zone"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={row.priorityCategory === "CRITICAL" ? "destructive" : row.priorityCategory === "HIGH" ? "warning" : "secondary"}
                      className="text-[10px]"
                    >
                      {row.priorityCategory} ({row.priorityScore}/100)
                    </Badge>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {row.topShortageSkill}
                  </td>
                  <td className="p-3">
                    <Badge variant="destructive" className="text-[9px]">
                      HIGH GAP
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono">
                    {row.activeInterventionsCount} Active
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/government/districts/${row.districtId}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                        Dossier <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
