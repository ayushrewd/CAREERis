"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, Search, ArrowLeft, ArrowRight, ShieldCheck, TrendingUp, Filter } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function GovernmentIndiaOverviewPage() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<"NET_GAP" | "DEMAND" | "SUPPLY" | "PLACEMENT">("NET_GAP");

  useEffect(() => {
    fetch("/api/government/national")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStates(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredStates = states.filter(
    (s) =>
      s.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.capitalCity.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-xl font-bold font-heading">Pan-India Geographic Intelligence Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            28 States &amp; 8 Union Territories with preserved drill-down context &amp; skill gap metrics
          </p>
        </div>
      </div>

      {/* Metric Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search state, UT, capital city, or industrial hub..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Button
            size="sm"
            variant={selectedMetric === "NET_GAP" ? "default" : "outline"}
            className="text-xs h-8"
            onClick={() => setSelectedMetric("NET_GAP")}
          >
            Net Skill Gap
          </Button>
          <Button
            size="sm"
            variant={selectedMetric === "DEMAND" ? "default" : "outline"}
            className="text-xs h-8"
            onClick={() => setSelectedMetric("DEMAND")}
          >
            Employer Demand
          </Button>
          <Button
            size="sm"
            variant={selectedMetric === "PLACEMENT" ? "default" : "outline"}
            className="text-xs h-8"
            onClick={() => setSelectedMetric("PLACEMENT")}
          >
            Placement Rate
          </Button>
        </div>
      </div>

      {/* State Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading pan-India state radar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStates.map((st) => (
            <Card key={st.stateCode} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">{st.stateCode}</Badge>
                  <Badge
                    variant={st.priorityCategory === "CRITICAL" ? "destructive" : st.priorityCategory === "HIGH" ? "warning" : "secondary"}
                    className="text-[10px]"
                  >
                    {st.priorityCategory}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{st.stateName}</CardTitle>
                <CardDescription className="text-[11px]">
                  Capital: {st.capitalCity} &bull; {st.totalDistrictsCount} Districts
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px]">Annual Demand:</span>
                    <span className="font-bold text-foreground">{st.annualEmployerDemand?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px]">Verified Supply:</span>
                    <span className="font-bold text-emerald-600">{st.annualVerifiedSupply?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-1">
                    <span className="text-muted-foreground text-[10px]">Net Deficit Gap:</span>
                    <span className="font-bold text-rose-600 font-mono">-{st.netSkillGap?.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <span className="text-muted-foreground text-[10px] block">Top Critical Shortage:</span>
                  <span className="font-semibold text-foreground truncate block">{st.topShortageSkills?.[0] || "Advanced Technical Skills"}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                  <span className="text-muted-foreground">Placement Rate: <span className="font-bold text-foreground">{st.averagePlacementRatePercentage}%</span></span>
                  <Link href={`/government/states/${st.stateCode}`}>
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2 gap-1 text-primary">
                      Drill-Down <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
