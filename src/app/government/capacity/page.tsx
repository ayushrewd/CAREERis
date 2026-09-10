"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Wrench, Users, BookOpen, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function GovernmentCapacityPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>Vocational Infrastructure &amp; Trainer Census</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Training Capacity &amp; Equipment Bottleneck Analysis
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identify equipment deficits, trainer vacancies, and seat capacity shortfalls across state ITIs.
          </p>
        </div>

        <Badge variant="purple" className="text-xs">
          National ITI Grid
        </Badge>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total ITI Seats"
          value="14,200 Trainees"
          change="Maharashtra State"
          isPositive={true}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Active Test Benches"
          value="480 Workstations"
          change="92% Operational"
          isPositive={true}
          icon={<Wrench className="w-4 h-4" />}
        />
        <StatCard
          title="Trainer ToT Deficit"
          value="64 Vacancies"
          change="EV &amp; Robotics Instructors"
          isPositive={false}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <StatCard
          title="Lab Upgrades Funded"
          value="₹42.5 Cr Allocated"
          change="DSDP 2026-27"
          isPositive={true}
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Equipment Shortage Hotspots */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Identified Equipment Shortages in High-Demand Clusters</CardTitle>
          <CardDescription className="text-xs">
            ITI lab modernization required to meet local manufacturing hiring mandates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">District / Institute</th>
                  <th className="py-3 px-4">Equipment Deficit</th>
                  <th className="py-3 px-4 text-center">Required Units</th>
                  <th className="py-3 px-4 text-center">Budget Estimate</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/20">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    Government ITI Aundh (Pune)
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">High-Voltage Battery Cyclers (400V)</td>
                  <td className="py-3 px-4 text-center font-bold">4 Units</td>
                  <td className="py-3 px-4 text-center font-bold text-primary">₹1.80 Cr</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success">Procurement Approved</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    Government ITI Chhatrapati Sambhajinagar
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">Siemens S7-1500 PLC Simulation Stations</td>
                  <td className="py-3 px-4 text-center font-bold">8 Rigs</td>
                  <td className="py-3 px-4 text-center font-bold text-primary">₹95 Lakhs</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning">Under Review</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
