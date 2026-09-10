"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, CheckCircle2, Clock, Award, ShieldCheck, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default function CareerJourneyPage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/journey")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setMilestones(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <History className="w-3.5 h-3.5 mr-1" /> LONGITUDINAL CAREER JOURNEY
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Career Timeline &amp; EPFO-Verified Retention Milestones
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chronological audit of skills acquired, assessments passed, verifiable credentials earned, and 365-day employment retention
          </p>
        </div>
      </div>

      <div className="relative border-l border-primary/30 ml-4 pl-6 space-y-6">
        {milestones.map((m) => (
          <div key={m.milestoneId} className="relative">
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${m.status === "COMPLETED" ? "border-emerald-500 text-emerald-500" : "border-primary text-primary"}`}>
              {m.status === "COMPLETED" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-2.5 h-2.5" />}
            </div>

            <Card className="shadow-subtle hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.status === "COMPLETED" ? "success" : "secondary"} className="text-[10px] font-mono">
                      {m.stage}
                    </Badge>
                    <CardTitle className="text-sm font-bold">{m.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs pt-0.5">
                    {new Date(m.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </CardDescription>
                </div>

                {m.evidenceUri && (
                  <Button asChild size="sm" variant="outline" className="text-[10px] h-6 px-2 gap-1">
                    <a href={m.evidenceUri} target="_blank" rel="noreferrer">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verify Proof
                    </a>
                  </Button>
                )}
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <p>{m.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
