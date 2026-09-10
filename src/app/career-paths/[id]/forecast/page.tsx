"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function RoleForecastDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [roleForecast, setRoleForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/intelligence/forecasts/roles/${id}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setRoleForecast(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading role forecast...</div>;
  if (!roleForecast) return <div className="p-8 text-center text-sm text-muted-foreground">Role forecast not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/career-paths">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Career Paths
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">{roleForecast.roleTitle}</h1>
            <Badge variant={roleForecast.trajectoryStatus === "RISING" ? "success" : "destructive"} className="text-xs">
              {roleForecast.trajectoryStatus}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Industry: {roleForecast.industry} &bull; Career Advancement Score: {roleForecast.careerAdvancementScore}/100
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Current Open Requisitions</span>
            <span className="text-2xl font-bold font-mono text-foreground block">
              {roleForecast.currentRequisitions?.toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Projected 12M Requisitions</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block">
              {roleForecast.projected12MRequisitions?.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">+{roleForecast.growthPercentage}% YoY</span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Entry Salary Range</span>
            <span className="text-sm font-bold font-mono text-foreground block">
              {formatCurrencyINR(roleForecast.averageEntrySalaryINR?.min)} - {formatCurrencyINR(roleForecast.averageEntrySalaryINR?.max)}
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground">Advancement Score</span>
            <span className="text-2xl font-bold font-mono text-primary block">
              {roleForecast.careerAdvancementScore}/100
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
