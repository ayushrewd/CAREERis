"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Plus, Building2, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

export default function EmployerDemandReportingPage() {
  const [demandReports, setDemandReports] = useState([
    {
      id: "dem-1",
      skillName: "Battery Management Systems (BMS) Calibration",
      projected12mHiring: 140,
      scarcityLevel: "HIGH_SCARCITY",
      cluster: "Chakan Auto Corridor, Pune",
      timeframe: "Next 12 Months",
    },
    {
      id: "dem-2",
      skillName: "PMSM Motor Inverter Field-Oriented Control",
      projected12mHiring: 85,
      scarcityLevel: "MODERATE_SCARCITY",
      cluster: "Chakan Auto Corridor, Pune",
      timeframe: "Next 6 Months",
    },
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [newVolume, setNewVolume] = useState(50);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setDemandReports([
      {
        id: `dem-${Date.now()}`,
        skillName: newSkill,
        projected12mHiring: newVolume,
        scarcityLevel: "HIGH_SCARCITY",
        cluster: "Chakan Auto Corridor, Pune",
        timeframe: "Next 12 Months",
      },
      ...demandReports,
    ]);

    setNewSkill("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Industrial Hiring Demand Ingestion</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Report Cluster Skill Demand &amp; Forecasts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit anticipated hiring demands to alert government planners, ITI curriculum designers, and candidate upskilling pathways.
          </p>
        </div>

        <Badge variant="success" className="text-xs">
          Employer Submitted Data (Tagged)
        </Badge>
      </div>

      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demand signal submitted and linked to Pune District Skill Plan radar.</span>
        </div>
      )}

      {/* Submission Form */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Submit Hiring Projection Signal</CardTitle>
          <CardDescription className="text-xs">
            Directly impacts local ITI lab funding and trainer allocation priorities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDemand} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Hard-to-Find Competency</label>
              <Input
                required
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. ROS 2 Mobile Robot Navigation"
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Projected 12-Month Openings</label>
              <Input
                type="number"
                value={newVolume}
                onChange={(e) => setNewVolume(parseInt(e.target.value) || 0)}
                className="text-xs"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm" className="w-full font-semibold gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" />
                Submit Demand Signal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Historical Signals Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Active Employer Signals for Tata Motors EV ({demandReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {demandReports.map((d) => (
            <div key={d.id} className="p-4 rounded-xl border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground text-sm">{d.skillName}</h4>
                <p className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  {d.cluster} &bull; {d.timeframe}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-foreground bg-background px-2.5 py-1 rounded border">
                  {d.projected12mHiring} Positions Projected
                </span>
                <Badge variant={d.scarcityLevel === "HIGH_SCARCITY" ? "destructive" : "warning"} className="text-[10px]">
                  {d.scarcityLevel.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
