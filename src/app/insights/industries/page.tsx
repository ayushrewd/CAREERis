"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Building2, TrendingUp, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export default function IndustriesIndexPage() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/industries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setIndustries(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <Link href="/insights" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Canonical Industry Sectors &amp; Requisitions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            40+ structured industrial sectors tracking annual hiring volumes, emerging technology penetration, and critical skills.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">Loading Industry Taxonomy...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <Card key={ind.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ind.sector}</span>
                    {ind.isEmergingSector && (
                      <Badge variant="warning" className="text-[9px] font-semibold">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Emerging Sector
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-sm text-foreground">{ind.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{ind.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t text-xs font-mono">
                    <span className="text-muted-foreground">Annual Volume:</span>
                    <span className="font-bold text-foreground">{ind.annualHiringVolume.toLocaleString("en-IN")} units</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">YoY Growth:</span>
                    <span className="font-bold text-emerald-600">+{ind.growthRateYoY}%</span>
                  </div>

                  <div className="pt-2">
                    <Link href={`/insights/industries/${ind.id}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold justify-between">
                        <span>Sector Intelligence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DataProvenancePanel
            sourceName="CareerIS Industry Taxonomy Registry"
            period="2026-Q2"
            confidenceScore={96}
          />
        </div>
      )}
    </div>
  );
}
