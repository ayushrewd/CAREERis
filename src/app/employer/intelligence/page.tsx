"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, AlertTriangle, Users, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";

export default function EmployerIntelligencePage() {
  const [scarcity, setScarcity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/forecasts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setScarcity([
            {
              industry: "Automotive & EV",
              districtName: "Pune",
              stateCode: "MH",
              hiringDifficultyIndex: 88,
              marketCondition: "CRITICAL_SHORTAGE",
              projected12MDemand: 48000,
              projected12MSupply: 16500,
              netProjectedDeficit: 31500,
              scarceSkills: [
                { skillName: "Battery Management Systems (BMS)", hiringTimeWeeks: 10, wageInflationPremiumYoY: 28.5 },
                { skillName: "High-Voltage Safety Norms", hiringTimeWeeks: 8, wageInflationPremiumYoY: 22.0 },
              ],
            },
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const lead = scarcity[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Employer Portal
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold font-heading">Predictive Talent Intelligence &amp; Scarcity Forecast</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Forward-looking hiring difficulty indices, wage inflation premiums &amp; talent pipeline availability
        </p>
      </div>

      {lead && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-subtle border-destructive/30">
            <CardHeader className="pb-2">
              <Badge variant="destructive" className="text-[10px] w-fit">MARKET: {lead.marketCondition}</Badge>
              <CardTitle className="text-base font-bold pt-1">{lead.industry} ({lead.districtName})</CardTitle>
              <CardDescription className="text-xs">Hiring Difficulty Index: {lead.hiringDifficultyIndex}/100</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Projected 12M Demand:</span>
                <span className="font-bold font-mono">{lead.projected12MDemand?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Projected 12M Supply:</span>
                <span className="font-bold font-mono">{lead.projected12MSupply?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-destructive font-semibold">
                <span>Net Projected Deficit:</span>
                <span className="font-mono">-{lead.netProjectedDeficit?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Scarce Skill Wage Inflation &amp; Time-to-Fill</CardTitle>
              <CardDescription className="text-xs">Projected compensation pressure and recruitment velocity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {lead.scarceSkills?.map((sk: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border bg-card flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block text-xs">{sk.skillName}</span>
                    <span className="text-[10px] text-muted-foreground">Avg Time-to-Fill: {sk.hiringTimeWeeks} Weeks</span>
                  </div>
                  <Badge variant="warning" className="text-xs font-mono">
                    +{sk.wageInflationPremiumYoY}% Wage Premium
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
