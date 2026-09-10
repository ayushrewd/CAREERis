"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Landmark,
  ShieldCheck,
  Zap,
  ArrowRight,
  Award,
  RefreshCw,
  Building2,
  MapPin,
  TrendingUp,
  Download,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

interface DistrictClusterPlan {
  id: string;
  district: string;
  state: string;
  cluster: string;
  obsoleteTrade: string;
  obsoleteSeatsToRetire: number;
  emergingTrade: string;
  seatsToCreate: number;
  oemHiringDemand: number;
  status: "DRAFT" | "GAZETTED_ACTION";
}

const INITIAL_DISTRICT_PLANS: DistrictClusterPlan[] = [
  {
    id: "dp-pune",
    district: "Pune",
    state: "Maharashtra",
    cluster: "Chakan-Talegaon Automotive OEM Corridor",
    obsoleteTrade: "Carburetor Internal Combustion Mechanics",
    obsoleteSeatsToRetire: 480,
    emergingTrade: "High-Voltage EV Battery Management (BMS)",
    seatsToCreate: 480,
    oemHiringDemand: 1850,
    status: "GAZETTED_ACTION",
  },
  {
    id: "dp-noida",
    district: "Gautam Buddha Nagar (Greater Noida)",
    state: "Uttar Pradesh",
    cluster: "Yamuna Expressway IT & Electronics Corridor",
    obsoleteTrade: "2D Paper Drafting & Manual Data Entry",
    obsoleteSeatsToRetire: 320,
    emergingTrade: "AI / ML & PyTorch Cloud Microservices",
    seatsToCreate: 320,
    oemHiringDemand: 2400,
    status: "GAZETTED_ACTION",
  },
  {
    id: "dp-chennai",
    district: "Kancheepuram",
    state: "Tamil Nadu",
    cluster: "Sriperumbudur Electronics & Robotics Corridor",
    obsoleteTrade: "Analog Wireman & Relay Soldering",
    obsoleteSeatsToRetire: 260,
    emergingTrade: "Industrial Robotics & SMT Automation",
    seatsToCreate: 260,
    oemHiringDemand: 1600,
    status: "GAZETTED_ACTION",
  },
];

export default function NationalTrainingPlanPage() {
  const [districtPlans, setDistrictPlans] = useState<DistrictClusterPlan[]>(INITIAL_DISTRICT_PLANS);
  const [gazettedId, setGazettedId] = useState<string | null>(null);

  const handleGazette = (id: string) => {
    setDistrictPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "GAZETTED_ACTION" } : p))
    );
    setGazettedId(id);
    setTimeout(() => setGazettedId(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Government Command Center
          </Button>
        </Link>
      </div>

      {/* SIH26134 Header */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              <Landmark className="w-3.5 h-3.5 mr-1" />
              SIH26134 District-Level Skill Alignment
            </Badge>
            <Badge variant="secondary" className="text-xs font-mono bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              District Skill Committee (DSC) Synchronized
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            District Training Plans &amp; Seat Re-Allocation Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
            Translates local industrial hiring demand directly into district vocational capacity. Shifting dormant training seats from declining trades to high-growth emerging sectors across industrial corridors.
          </p>
        </div>
      </div>

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <Card className="shadow-subtle p-4 space-y-1 border bg-card">
          <span className="text-muted-foreground block font-medium">Re-Allocated Capacity</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block">1,060 Seats</span>
          <span className="text-[10px] text-muted-foreground">Shifted to AI, EV &amp; Robotics</span>
        </Card>

        <Card className="shadow-subtle p-4 space-y-1 border bg-card">
          <span className="text-muted-foreground block font-medium">OEM Cluster Demand</span>
          <span className="text-2xl font-bold font-mono text-primary block">5,850 Vacancies</span>
          <span className="text-[10px] text-muted-foreground">Verified Requisition Signals</span>
        </Card>

        <Card className="shadow-subtle p-4 space-y-1 border bg-card">
          <span className="text-muted-foreground block font-medium">Placement Gain</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block">+38.4% YoY</span>
          <span className="text-[10px] text-muted-foreground">Compared to Obsolete Trades</span>
        </Card>

        <Card className="shadow-subtle p-4 space-y-1 border bg-card">
          <span className="text-muted-foreground block font-medium">District Clusters Active</span>
          <span className="text-2xl font-bold font-mono text-foreground block">3 Strategic Hubs</span>
          <span className="text-[10px] text-muted-foreground">Maharashtra, UP &amp; Tamil Nadu</span>
        </Card>
      </div>

      {/* District Action Plan Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span>Gazetted District Skill Action Plans (2026-2027)</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {districtPlans.map((plan) => (
            <Card key={plan.id} className="border shadow-subtle hover:border-primary/40 transition-all">
              <CardContent className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold text-foreground">
                        <MapPin className="w-3 h-3 mr-1 text-primary" />
                        {plan.district}, {plan.state}
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[10px] font-mono">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active Action Plan
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-foreground font-heading mt-1.5">
                      {plan.cluster}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-black font-heading text-primary font-mono block">
                      {plan.oemHiringDemand.toLocaleString()} Open Roles
                    </span>
                    <span className="text-[10px] text-muted-foreground">Immediate Cluster Demand</span>
                  </div>
                </div>

                {/* Seat Re-Allocation Equation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/20 border text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-rose-600 text-[11px] flex items-center gap-1">
                      <span>🔻 Retire Obsolete Trade:</span>
                    </span>
                    <p className="font-semibold text-foreground">{plan.obsoleteTrade}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Closing {plan.obsoleteSeatsToRetire} legacy seats with low placement (&lt;35%)
                    </span>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l md:pl-3 pt-2 md:pt-0">
                    <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1">
                      <span>🔺 Create High-Growth Capacity:</span>
                    </span>
                    <p className="font-semibold text-foreground">{plan.emergingTrade}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Unlocking +{plan.seatsToCreate} modern seats with direct hiring tie-up
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Evidence Source: <strong className="text-foreground">EPFO Payroll Data &amp; Corporate Requisitions</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleGazette(plan.id)}
                      size="sm"
                      className="text-xs font-bold gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{gazettedId === plan.id ? "✅ Gazetted & Dispatched!" : "Dispatch District Order"}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
