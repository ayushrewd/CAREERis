"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Building2, Plus } from "lucide-react";

export default function EmployerTrainingRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/training-requests")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRequests(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <BookOpen className="w-3.5 h-3.5 mr-1" /> TRAINING DEMAND MARKETPLACE
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Sponsored Training Demands &amp; Provider Capacity Responses
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit batch training requirements and match with accredited ITI/Polytechnic Centres of Excellence
          </p>
        </div>

        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Submit Training Demand
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <Card key={r.requestId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "RESPONDED" ? "success" : "outline"} className="text-[10px] font-mono">
                    {r.status}
                  </Badge>
                  <CardTitle className="text-base font-bold">{r.roleTargetTitle}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-0.5">
                  Employer: <span className="font-bold text-foreground">{r.employerName}</span> &bull; Target: {r.headcountNeeded} Candidates &bull; District: {r.targetDistrict}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-primary block">
                  Timeline: {r.timelineWeeks} Weeks
                </span>
                <span className="text-[10px] text-muted-foreground">{r.responses?.length || 0} Provider Quotes</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground mr-1">Required Skills:</span>
                {r.requiredSkills?.map((s: string) => (
                  <Badge key={s} variant="outline" className="text-[9px]">{s}</Badge>
                ))}
              </div>

              {/* Provider Responses */}
              {r.responses?.length > 0 && (
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-2">
                  <span className="font-bold text-foreground block">Matched Training Provider Responses:</span>
                  {r.responses.map((resp: any) => (
                    <div key={resp.responseId} className="p-2 rounded bg-card border flex items-center justify-between">
                      <div>
                        <span className="font-bold">{resp.providerName}</span>
                        <span className="text-[10px] text-muted-foreground block">
                          Course: {resp.courseTitle} &bull; Capacity: {resp.offeredCapacity} seats
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-600 block">
                          ₹{resp.quotePerTraineeINR?.toLocaleString()} / Trainee
                        </span>
                        <span className="text-[10px] text-muted-foreground">Equipment Score: {resp.equipmentReadinessScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
