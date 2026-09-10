"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, ArrowRight, CheckCircle2, TrendingUp, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function CareerPathsPage() {
  const pathways = [
    {
      title: "Electric Vehicle Battery & Powertrain Engineering",
      sector: "Automotive & Electric Mobility",
      steps: [
        { level: "Entry / Trainee", role: "EV Battery Assembly Technician", skills: ["High-Voltage Safety", "Cell Sorting", "Wiring Harness"] },
        { level: "Mid / Technician", role: "Battery Management Systems (BMS) Calibration Specialist", skills: ["BMS Algorithms", "CAN Protocol", "HIL Simulation"] },
        { level: "Senior / Lead", role: "EV Powertrain System Architect", skills: ["FOC Motor Drives", "Battery Thermal Design", "System Architecture"] },
      ],
      growth: "+48% Industry Demand",
    },
    {
      title: "Industry 4.0 Industrial Automation & Robotics",
      sector: "Advanced Manufacturing",
      steps: [
        { level: "Entry / Trainee", role: "Junior PLC & Panel Wireman", skills: ["Control Panel Wiring", "Sensor Integration", "Basic Ladder Logic"] },
        { level: "Mid / Technician", role: "Industrial Automation & SCADA Engineer", skills: ["Siemens S7-1500", "PROFINET TSN", "SCADA Architecture"] },
        { level: "Senior / Lead", role: "Smart Factory Robotics & AI Lead", skills: ["ROS 2 Autonomous SLAM", "Industrial IoT", "Predictive Maintenance"] },
      ],
      growth: "+36% Industry Demand",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Career Trajectories</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Personalized Career Pathways &amp; Progression Maps
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step vocational learning milestones connecting entry-level ITI training to advanced high-compensation roles.
          </p>
        </div>

        <Badge variant="purple" className="text-xs">
          Competency-Mapped
        </Badge>
      </div>

      {/* Pathways List */}
      <div className="space-y-6">
        {pathways.map((pw, i) => (
          <Card key={i} className="p-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary">{pw.sector}</span>
                  <CardTitle className="text-lg mt-0.5">{pw.title}</CardTitle>
                </div>
                <Badge variant="success" className="text-xs font-semibold">
                  {pw.growth}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {pw.steps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-muted/20 relative flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        Stage 0{idx + 1} &bull; {step.level}
                      </span>
                      <h4 className="font-semibold text-sm text-foreground mt-1 mb-2">
                        {step.role}
                      </h4>
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Required Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {step.skills.map((sk) => (
                            <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-background border font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t flex items-center justify-between text-xs">
                      <Link href="/courses" className="text-primary font-medium hover:underline text-[11px]">
                        View ITI Courses &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
