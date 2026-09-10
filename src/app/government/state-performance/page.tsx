"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function StatePerformancePage() {
  const states = [
    {
      code: "MH",
      name: "Maharashtra",
      placedTotal: 8420,
      retention365d: 89.4,
      fundingUtilizedCr: 48.79,
      keyCluster: "Pune / Chakan Auto & Electronics",
    },
    {
      code: "TN",
      name: "Tamil Nadu",
      placedTotal: 7150,
      retention365d: 87.2,
      fundingUtilizedCr: 39.5,
      keyCluster: "Sriperumbudur EV & Hardware",
    },
    {
      code: "GJ",
      name: "Gujarat",
      placedTotal: 6200,
      retention365d: 86.0,
      fundingUtilizedCr: 32.1,
      keyCluster: "Sanand / Mandal Auto & Solar",
    },
    {
      code: "KA",
      name: "Karnataka",
      placedTotal: 5800,
      retention365d: 88.1,
      fundingUtilizedCr: 35.4,
      keyCluster: "Bengaluru / Hosur Aerospace & Semi",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">State &amp; UT Performance Benchmark</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent multi-metric state benchmarking based on EPFO retention, industrial cluster placement &amp; fund utilization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {states.map((st) => (
          <Card key={st.code} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-mono">{st.code}</Badge>
                <span className="text-xs font-bold text-emerald-600">365d Retention: {st.retention365d}%</span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{st.name}</CardTitle>
              <CardDescription className="text-xs">
                Key Hub: <span className="font-bold text-foreground">{st.keyCluster}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg border bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Verified Placements</span>
                  <span className="font-mono font-bold text-foreground">{st.placedTotal?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Utilized Funding</span>
                  <span className="font-mono font-bold text-primary">₹{st.fundingUtilizedCr} Cr</span>
                </div>
              </div>

              <Link href={`/government/state-intelligence?stateCode=${st.code}`}>
                <Button size="sm" variant="outline" className="w-full text-xs h-7 gap-1">
                  State Intelligence Overview <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
